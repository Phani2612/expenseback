import { Config } from "../config/config.js";

export const LimitNotificationTemplate = (username, expense, income) => {
    const monthName = new Date().toLocaleString('default', { month: 'long' }); // Example: April

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Expense Alert</title>
    </head>
    <body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 20px 30px; text-align: center;">
            <h2 style="color: #ff4d4f;">⚠️ Expense Alert - ${monthName}</h2>
            <p style="font-size: 16px; color: #555;">
              Hello <strong>${username}</strong>,
            </p>
            <p style="font-size: 15px; color: #333;">
              We noticed that your total expenses for <strong>${monthName}</strong> (<strong style="color:#ff4d4f;">₹${expense}</strong>)
              are approaching or exceeding your total income (<strong style="color: #52c41a;">₹${income}</strong>).
            </p>
            <p style="font-size: 15px; color: #333;">
              Please monitor your spending to ensure financial stability.
            </p>
            <a href="${Config.FRONT_END}/dashboard" style="display: inline-block; margin: 20px auto; padding: 12px 25px; background: #1890ff; color: white; text-decoration: none; border-radius: 5px;">
              Go to Dashboard
            </a>
            <p style="font-size: 13px; color: #aaa; margin-top: 30px;">
              — Your Expense Tracker Team
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
};
