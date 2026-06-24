import { useState } from 'react';
import { supabase } from '../supabase';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { Capacitor } from '@capacitor/core';
import { SMSInboxReader } from 'capacitor-sms-inbox';

export const useSmsScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useStore();
  const { addToast } = useToastStore();

  const parseBankSMS = (message: string) => {
    // Regular expressions to detect Indian Bank SMS patterns
    const debitedRegex = /(?:debited|spent|deducted).*?(?:rs\.?|inr|₹)\s*([0-9,]+\.[0-9]{0,2})|(?:rs\.?|inr|₹)\s*([0-9,]+\.[0-9]{0,2}).*?(?:debited|spent|deducted)/i;
    const creditedRegex = /(?:credited|received|added).*?(?:rs\.?|inr|₹)\s*([0-9,]+\.[0-9]{0,2})|(?:rs\.?|inr|₹)\s*([0-9,]+\.[0-9]{0,2}).*?(?:credited|received|added)/i;
    const balanceRegex = /(?:bal|balance|avl bal|available balance)[\s:-]*(?:rs\.?|inr|₹)?\s*([0-9,]+\.[0-9]{0,2})/i;

    const debitMatch = message.match(debitedRegex);
    const creditMatch = message.match(creditedRegex);
    const balanceMatch = message.match(balanceRegex);

    return {
      type: debitMatch ? 'expense' : creditMatch ? 'income' : null,
      amount: debitMatch ? parseFloat((debitMatch[1] || debitMatch[2]).replace(/,/g, '')) 
            : creditMatch ? parseFloat((creditMatch[1] || creditMatch[2]).replace(/,/g, '')) 
            : null,
      balance: balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : null,
    };
  };

  const scanLatestSMS = async () => {
    if (!user) return;
    setIsScanning(true);
    addToast('Requesting SMS permissions...', 'info');

    try {
      if (!Capacitor.isNativePlatform()) {
        addToast('SMS scanning is only available on mobile apps.', 'error');
        setIsScanning(false);
        return;
      }

      const permissionStatus = await SMSInboxReader.checkPermissions();
      if (permissionStatus.sms !== 'granted') {
        const req = await SMSInboxReader.requestPermissions();
        if (req.sms !== 'granted') {
          addToast('SMS permission denied. Cannot scan messages.', 'error');
          setIsScanning(false);
          return;
        }
      }

      addToast('Scanning recent messages...', 'info');
      const { smsList } = await SMSInboxReader.getSMSList({
        filter: { maxCount: 20 }
      });

      if (smsList && smsList.length > 0) {
        let foundTransactions = 0;
        
        for (const sms of smsList) {
          const message = sms.body;
          const parsed = parseBankSMS(message);
          
          if (parsed.amount && parsed.type) {
            foundTransactions++;
            const table = parsed.type === 'income' ? 'income' : 'expenses';
            
            // Format date for Supabase
            const dateObj = sms.date ? new Date(sms.date) : new Date();
            const transactionDate = dateObj.toISOString().split('T')[0];
            const sender = sms.address || 'Bank SMS';

            const payload = parsed.type === 'income' 
              ? { user_id: user.id, source: sender, amount: parsed.amount, category: 'Bank Sync', transaction_date: transactionDate, notes: message }
              : { user_id: user.id, expense_name: sender, amount: parsed.amount, category: 'Bank Sync', transaction_date: transactionDate, notes: message };

            await supabase.from(table).insert([payload]);
            addToast(`Synced ${parsed.type === 'expense' ? 'Debit' : 'Credit'}: ₹${parsed.amount}`, 'success');
          }
        }
        
        if (foundTransactions === 0) {
          addToast('No new bank transactions found in recent SMS.', 'info');
        } else {
          addToast(`Successfully scanned and synced ${foundTransactions} transactions!`, 'success');
        }
      } else {
        addToast('No SMS messages found on device.', 'info');
      }

    } catch (error) {
      console.error(error);
      addToast('Failed to read SMS.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  return { scanLatestSMS, isScanning, parseBankSMS };
};
