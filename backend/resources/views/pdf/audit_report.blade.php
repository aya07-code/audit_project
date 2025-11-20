<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            color: #333;
        }
        .container {
            width: 90%;
            margin: auto;
            padding: 20px;
            background-color: #fff;
        }
        .header { 
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1E3A8A;
            font-size: 28px;
        }
        .info-section {
            margin-bottom: 25px;
            padding: 15px;
            background: #e8f0fe;
            border-radius: 8px;
        }
        .info-section h3 {
            margin-bottom: 10px;
            color: #1E3A8A;
            font-size: 18px;
            border-bottom: 1px solid #cfd8e3;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background-color: #fff;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
            font-size: 14px;
        }
        th {
            background-color: #1E3A8A;
            color: #fff;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .score {
            font-size: 18px;
            color: #10B981;
            font-weight: bold;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Audit Report</h1>
        </div>

        <div class="info-section">
            <h3>Customer Information</h3>
            <p><strong>Company:</strong> {{ $company->name }}</p>
            <p><strong>Phone:</strong> {{ $customer->phone }}</p>
            <p><strong>Email:</strong> {{ $customer->email }}</p>
        </div>

        <div class="info-section">
            <h3>Audit Details</h3>
            <p><strong>Title:</strong> {{ $audit->title }}</p>
            <p><strong>Date:</strong> {{ $audit->date }}</p>
            <p class="score"><strong>Score Global:</strong> {{ $auditCompany->score ?? '-' }}%</p>
        </div>

        <h3>Questions and Answers</h3>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Justification</th>
                </tr>
            </thead>
            <tbody>
                @foreach($questions as $index => $question)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $question['text'] }}</td>
                    <td>{{ $question['choice'] }}</td>
                    <td>{{ $question['justification'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            <p>Document generated on {{ $generated_at }}</p>
        </div>
    </div>
</body>
</html>
