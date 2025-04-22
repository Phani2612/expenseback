const EXPENSE_MAIL_TEMPLATE = (username ,expense , duedate)=>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Reminder</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            color: #fff;
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .expense-details {
            margin-top: 20px;
            font-size: 16px;
        }
        .expense-details table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .expense-details th, .expense-details td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        .expense-details th {
            background-color: #f4f4f9;
            color: #333;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #777;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>

<div class="email-container">
    <!-- Header -->
    <div class="header">
        <h1>Expense Reminder</h1>
    </div>

    <!-- Expense Details -->
    <div class="expense-details">
        <p>Hello ${username},</p>
        <p>We would like to remind you that the following recurring expense is due soon:</p>

        <table>
            <tr>
                <th>Expense Name</th>
                <td>${expense.title}</td>
            </tr>
            <tr>
                <th>Amount</th>
                <td>${expense.amount}</td>
            </tr>
            <tr>
                <th>Frequency</th>
                <td>${expense.frequency}</td>
            </tr>
            <tr>
                <th>Due Date</th>
                <td>${duedate}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>pending</td>
            </tr>
        </table>

        <p>This is a friendly reminder to make sure your expense is processed on time. If you need any further assistance, feel free to reach out.</p>
        <p>Best regards, <br>Your Expense Tracker Team</p>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>If you no longer wish to receive these reminders, you can <a href="{{unsubscribeLink}}">unsubscribe here</a>.</p>
    </div>
</div>

</body>
</html>
`
}


export default EXPENSE_MAIL_TEMPLATE