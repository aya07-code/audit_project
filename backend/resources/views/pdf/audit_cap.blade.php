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
        .containerr { width: 95%; margin: auto; }
        .header {
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
        }
        
        .info-section {
            margin-bottom: 10px;
            padding: 15px;
            background: #e6f0ff; /* soft blue */
            border-radius: 8px;
        }
        .info-section h5 {
            margin-bottom: 10px;
            margin-top: -10px;
            color: #1E3A8A; 
            font-size: 16px;
            border-bottom: 1px solid #bbccfaff;
            padding-bottom: 5px;
        }

        /* CARDS STILL RED (UNCHANGED) */
        .card {
            background-color: #f4f6f8;
            border: 1px solid #ddd;
            border-left: 4px solid #dc2626; /* RED stays */
            border-radius: 8px;
            padding: 5px 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .card h5 { 
            margin: 0 0 10px; 
            font-size: 14px; 
            color: #1E3A8A; 
        }

        p { font-size: 9px; margin: 6px 0; }

        /* BADGE STILL RED */
        .badge {
            padding: 3px 5px;
            border-radius: 4px;
            color: #fff;
            font-size: 11px;
            background-color: #dc2626; /* RED */
        }

        .comment {
            background-color: #FDE68A;
            padding: 3px 5px;
            border-radius: 4px;
            font-size: 11px;
        }

        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
        .titre {
            margin-top: 1px;
            margin-bottom: 2px;
            font-size: 16px;
            padding-bottom: 5px;
        }
    </style>
</head>
<body style="background-color: #fff; margin:0; padding:0;">
    <div class="containerr">
    <div class="header">
        <table width="100%">
            <tr>
                <td style="width:30%; height:30px; ">
                   <img src="file://{{ public_path('logo.png') }}" style="width:90px; margin:0;"> 
                </td>
                <td style="width:70%; height:30px;">
                    <h2 style="color:#B91C1C; font-size:24px; margin:0;">Corrective Action Plan (CAP)</h1>
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
        </div>

        <h5 class="titre">Incorrect Answers (CAP)</h5>

        @foreach($questions as $index => $q)
        <div class="card">
            <h5>{{ $index + 1 }}. {{ $q['text'] }}</h5>

            <p>
                <strong>Answer:</strong> {{ $q['choice'] }} /
                <strong>Proof:</strong> {{ $q['justification'] }} /
                <strong>Date:</strong> {{ $q['date'] }} /
                <strong>Organization:</strong> {{ $q['certificate_organisme'] }} /
                <strong>Other:</strong> {{ $q['certificate_customers_count'] }}
            </p>

            <p>
                <strong>Validation:</strong>
                <span class="badge">Inaccurate</span>
            </p>
            <p>
                <strong>Auditor Feedback:</strong>
                @if(!empty($q['comment_admin']))
                    <span class="comment">{{ $q['comment_admin'] }}</span>
                @else
                    -
                @endif
            </p>
        </div>
        @endforeach

        <div class="footer" style="text-align:center; margin-top:40px; font-size:12px; color:#666;">
            Document generated on {{ $generated_at }}
        </div>
    </div>
</body>

</html>
