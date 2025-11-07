<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body{font-family: DejaVu Sans, sans-serif; font-size:12px}
        h2{margin:0 0 8px 0}
        .meta{margin-bottom:12px}
        table{width:100%;border-collapse:collapse;margin-bottom:14px}
        th,td{border:1px solid #ddd;padding:6px;text-align:left;vertical-align:top}
        th{background:#f4f4f4}
        .section{margin-top:18px}
        .small{font-size:11px;color:#666}
        .just{white-space:pre-wrap}
    </style>
</head>
<body>
    <h2>Rapport des audits - {{ $company->name }}</h2>
    <div class="meta small">Généré le {{ $generated_at }}</div>

    @foreach($auditsData as $item)
        <div class="section">
            <h3>{{ $item['audit']->title }} (Date: {{ $item['audit']->date }} — Score: {{ $item['audit']->score ?? '-' }})</h3>

            @if($item['customers']->isEmpty())
                <p class="small">Aucune réponse enregistrée par les clients de cette entreprise pour cet audit.</p>
            @else
                @foreach($item['customers'] as $cust)
                    <table>
                        <thead>
                            <tr>
                                <th style="width:20%">Client ID</th>
                                <th style="width:20%">Question</th>
                                <th style="width:15%">Réponse</th>
                                <th style="width:45%">Justification</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($cust['answers'] as $ans)
                                <tr>
                                    <td>{{ $cust['customer_id'] }}</td>
                                    <td>{{ $ans['question_text'] ?? 'Q#'.$ans['question_id'] }}</td>
                                    <td>{{ $ans['choice'] }}</td>
                                    <td class="just">{{ $ans['justification'] ?? '-' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endforeach
            @endif
        </div>
    @endforeach

    <div class="small" style="margin-top:20px">Fin du rapport</div>
</body>
</html>