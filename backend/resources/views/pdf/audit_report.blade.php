<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif;
            padding: 20px; 
        }
        .header { 
            text-align: center;
            margin-bottom: 30px;
        }
        .info-section {
            margin-bottom: 20px;
            padding: 10px;
            background: #f8f9fa;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        .score {
            font-size: 18px;
            color: #2c3e50;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport d'Audit</h1>
    </div>

    <div class="info-section">
        <h3>Informations Client</h3>
        <p>Entreprise: {{ $company->name }}</p>
        <p>Contact: {{ $customer->name }}</p>
        <p>Email: {{ $customer->email }}</p>
    </div>

    <div class="info-section">
        <h3>Détails de l'Audit</h3>
        <p>Titre: {{ $audit->title }}</p>
        <p>Date: {{ $audit->date }}</p>
        <p class="score">Score Global: {{ $audit->score ?? 'Non évalué' }}</p>
    </div>

    <h3>Questions et Réponses</h3>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Question</th>
                <th>Réponse</th>
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
        <p>Document généré le {{ $generated_at }}</p>
    </div>
    <a href="" 
   class="btn btn-primary" 
   target="_blank">
    📄 Télécharger le rapport PDF
    </a>
</body>
</html>