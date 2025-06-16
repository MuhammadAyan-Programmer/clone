import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'treasureclone@gmail.com',
    pass: 'fttv zkcm jgjz whxs'
  }
});

export const sendDepositNotification = async (userEmail: string, amount: number) => {
  try {
    await transporter.sendMail({
      from: 'treasureclone@gmail.com',
      to: 'treasureclone@gmail.com',
      subject: 'New Deposit Alert - Treasure Clone',
      html: `
        <h2>New Deposit Alert</h2>
        <p><strong>User:</strong> ${userEmail}</p>
        <p><strong>Amount:</strong> $${amount.toFixed(2)} USDT</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p>Please verify and approve this deposit in the admin panel.</p>
      `
    });
  } catch (error) {
    console.error('Failed to send deposit notification:', error);
  }
};

export const sendWithdrawalNotification = async (userEmail: string, amount: number, walletAddress: string) => {
  try {
    await transporter.sendMail({
      from: 'treasureclone@gmail.com',
      to: 'treasureclone@gmail.com',
      subject: 'New Withdrawal Request - Treasure Clone',
      html: `
        <h2>New Withdrawal Request</h2>
        <p><strong>User:</strong> ${userEmail}</p>
        <p><strong>Amount:</strong> $${amount.toFixed(2)} USDT</p>
        <p><strong>Wallet Address:</strong> ${walletAddress}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p>Please process this withdrawal request in the admin panel.</p>
      `
    });
  } catch (error) {
    console.error('Failed to send withdrawal notification:', error);
  }
};
