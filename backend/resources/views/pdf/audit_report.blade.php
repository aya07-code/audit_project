<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fff;
            color: #333;
        }
        .container {
            width: 95%;
            margin: auto;
        }
        .header { 
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
        }
        .header h2 {
            color: #1E3A8A;
        }
        .info-section {
            margin-bottom: 10px;
            padding: 15px;
            background: #e8f0fe;
            border-radius: 8px;
        }
        .info-section h5 {
            margin-bottom: 10px;
            margin-top: -10px;
            color: #1E3A8A;
            font-size: 16px;
            border-bottom: 1px solid #cfd8e3;
            padding-bottom: 5px;
        }
        .card {
            background-color: #f4f6f8;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 5px 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            border-left: 4px solid #1E3A8A; 
        }
        .card h5 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #1E3A8A;
        }
        p {
            font-size: 9px;
            margin: 6px 0;
        }
        .badge {
            padding: 2px 3px;
            border-radius: 4px;
            color: #fff;
            font-size: 11px;
            display: inline-block;
        }
        .accurate { background-color: #10B981; }
        .inaccurate { background-color: #EF4444; }
        .unknown { background-color: #9CA3AF; }
        .comment {
            background-color: #FDE68A;
            padding: 2px 3px;
            border-radius: 4px;
            font-size: 11px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 40px;
        }
        .titre {
            margin-top: 1px;
            margin-bottom: 2px;
            font-size: 16px;
            padding-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <table width="100%">
                <tr>
                    <td style="width:40%; height:30px; ">
                    <img src="file://{{ public_path('logo.png') }}" style="width:90px; margin:0;"> 
                    </td>
                    <td style="width:60%; height:30px;">
                        <h2 style="font-size:24px; margin:0;">Audit Report</h1>
                    </td>
                </tr>
            </table>
        </div>
        <div class="info-section">
            <h5>Customer Information</h5>
            <p><strong>Company:</strong> {{ $company->name }}</p>
            <p><strong>Phone:</strong> {{ $customer->phone }}</p>
            <p><strong>Email:</strong> {{ $customer->email }}</p>
            <p><strong>Address:</strong> {{ $company->address }}</p>
        </div>

        <div class="info-section">
            <h5>Audit Details</h5>
            <p><strong>Audit standard:</strong> {{ $audit->title }}</p>
            <p><strong>Date:</strong> {{ $audit->date ?? '-' }}</p>
        </div>

        <h5 class="titre">Questions and Answers</h5>

        @foreach($questions as $index => $question)
        @php
            $statusClass = match($question['validation_status'] ?? '') {
                'accurate' => 'accurate',
                'inaccurate' => 'inaccurate',
                default => 'unknown',
            };
        @endphp

        <div class="card">
            <h5>{{ $index + 1 }}. {{ $question['text'] }}</h4>

            <!-- ALL DETAILS IN ONE LINE -->
            <p>
                <strong>Answer:</strong> {{ $question['choice'] }} /
                <strong>Proof:</strong> {{ $question['justification'] }} /
                <strong>Date:</strong> {{ $question['date'] }} /
                <strong>Organization:</strong> {{ $question['certificate_organisme'] }} /
                <strong>Other:</strong> {{ $question['certificate_customers_count'] }}
            </p>

            <!-- VALIDATION + COMMENT SAME LINE -->
            <p>
                <strong>Validation:</strong>
                <span class="badge {{ $statusClass }}">
                    {{ $question['validation_status'] ?? 'Not set' }}
                </span>
            </p>
            <p>
                <strong>Auditor Feedback:</strong>
                @if(!empty($question['comment_admin']))
                    <span class="comment">{{ $question['comment_admin'] }}</span>
                @else
                    -
                @endif
            </p>
        </div>

        @endforeach

        <div class="footer">
            <p>Document generated on {{ $generated_at }}</p>
        </div>
    </div>
</body>
</html>
