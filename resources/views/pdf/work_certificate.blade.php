<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Certificado Laboral</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            margin: 0;
            padding: 40px 50px;
            font-size: 14px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 40px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .company-nit {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
        }
        .doc-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 40px;
            color: #1e293b;
        }
        .addressed {
            font-weight: bold;
            margin-bottom: 25px;
            text-transform: uppercase;
        }
        .content {
            text-align: justify;
            margin-bottom: 30px;
        }
        .salary-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 15px 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .signature-section {
            margin-top: 70px;
            page-break-inside: avoid;
        }
        .signature-img {
            max-height: 80px;
            max-width: 200px;
            display: block;
            margin-bottom: -10px;
        }
        .signature-line {
            width: 250px;
            border-top: 1px solid #334155;
            margin-top: 10px;
            padding-top: 8px;
        }
        .signer-name {
            font-weight: bold;
            color: #0f172a;
        }
        .signer-pos {
            font-size: 12px;
            color: #475569;
        }
        .footer {
            position: fixed;
            bottom: 30px;
            left: 50px;
            right: 50px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">CENTROACEROS S.A.S.</div>
        <div class="company-nit">NIT: 800.123.456-7 — INTRANET CORPORATIVA</div>
    </div>

    <div class="doc-title">CERTIFICA</div>

    <div class="content">
        Que el(la) señor(a) <strong>{{ $employee->name }}</strong>, identificado(a) con {{ $employee->document_type ?? 'Cédula de ciudadanía' }} No. <strong>{{ $employee->identification ?? 'N/A' }}</strong>, labora en nuestra compañía desde el inicio de su contrato bajo la modalidad de <strong>{{ $employee->contract_type ?? 'Término Indefinido' }}</strong>, desempeñando el cargo de <strong>{{ $employee->position ?? 'Colaborador' }}</strong> en el departamento de <strong>{{ $employee->department ?? 'General' }}</strong>.
    </div>

    @if($includeSalary)
    <div class="salary-box">
        <div><strong>Salario Básico Mensual:</strong> {{ '$' . number_format((float)($employee->base_salary ?? 0), 0, ',', '.') }} COP</div>
        @if(($employee->monthly_bonuses ?? 0) > 0)
        <div style="margin-top: 5px;"><strong>Bonificaciones / Compensaciones Mensuales:</strong> {{ '$' . number_format((float)$employee->monthly_bonuses, 0, ',', '.') }} COP</div>
        @endif
    </div>
    @endif

    <div class="content">
        @if($certificate->reason)
        La presente certificación se expide a solicitud del interesado(a) con motivo de: <em>{{ $certificate->reason }}</em>, dirigida a: <strong>{{ strtoupper($certificate->addressed_to) }}</strong>.
        @else
        La presente certificación se expide a solicitud del interesado(a), dirigida a: <strong>{{ strtoupper($certificate->addressed_to) }}</strong>.
        @endif
    </div>

    <div class="content">
        Dado en Bogotá D.C., a los {{ $dateFormatted }}.
    </div>

    @if($certificate->admin_observations)
    <div class="content" style="margin-top: 20px; background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 6px; font-size: 13px;">
        <strong>Nota / Observación de la Entidad:</strong> {{ $certificate->admin_observations }}
    </div>
    @endif

    <div class="signature-section">
        @if($signatureBase64)
            <img src="{{ $signatureBase64 }}" alt="Firma" class="signature-img">
        @endif
        <div class="signature-line">
            <div class="signer-name">{{ $signer->name ?? 'Departamento de Recursos Humanos' }}</div>
            <div class="signer-pos">{{ $signer->position ?? 'Gestión Humana / Dirección' }}</div>
            <div class="signer-pos">CENTROACEROS S.A.S.</div>
        </div>
    </div>

    <div class="footer">
        Documento generado electrónicamente a través de la Intranet Corporativa Centroaceros.<br>
        Esta certificación cuenta con medidas de seguridad e integridad digital. Código de referencia: REF-CERT-{{ str_pad($certificate->id, 6, '0', STR_PAD_LEFT) }}
    </div>
</body>
</html>
