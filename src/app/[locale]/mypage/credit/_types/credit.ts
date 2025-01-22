export type PaymentOption = {
    amount: number;
    bonusRate: number;
  };
  
  export type CreditBalanceProps = {
    credit: number | undefined;
  };
  
  export type PaymentOptionsProps = {
    options: PaymentOption[];
    onPayment: (amount: number, bonus: number) => void;
  };