const generateContactConfirmationEmail = ( userName, summary, description)=> {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Confirmation</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f6f8;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                text-align: center;
                padding: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 30px;
                color: #333;
                line-height: 1.6;
            }
            .summary {
                background-color: #e6f7ff;
                border-left: 5px solid #1890ff;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 16px;
            }
            .description {
                background-color: #fef6e4;
                border-left: 5px solid #f4a261;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 16px;
            }
            .footer {
                background-color: #f4f6f8;
                text-align: center;
                padding: 15px;
                color: #888;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Thanks for Reaching Out, ${userName}!</h1>
            </div>
            <div class="content">
                <p>Hello ${userName},</p>
                <p>We have successfully received your message! One of our team members will get back to you shortly.</p>
  
                <div class="summary">
                    <strong>Summary:</strong><br>
                    ${summary}
                </div>
  
                <div class="description">
                    <strong>Description:</strong><br>
                    ${description}
                </div>
  
                <p>In the meantime, feel free to explore our website or reach out if you have any further questions.</p>
                <p>We appreciate your interest!</p>
            </div>
            <div class="footer">
                © ${new Date().getFullYear()} Your Company Name — All Rights Reserved.
            </div>
        </div>
    </body>
    </html>
    `;
  }

  
  export default generateContactConfirmationEmail