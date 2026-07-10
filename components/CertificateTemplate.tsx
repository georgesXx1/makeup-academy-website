import styles from "./CertificateTemplate.module.css";

export type CertificateTemplateData = {
  studentName: string;
  courseName: string;
  issueDate: string;
  code: string;
};

type CertificateTemplateProps = {
  certificate: CertificateTemplateData;
  baseUrl: string;
  qrCodeDataUrl: string;
};

export function CertificateTemplate({ certificate, baseUrl, qrCodeDataUrl }: CertificateTemplateProps) {
  const verifyUrl = buildVerifyUrl(baseUrl, certificate.code);

  return (
    <article className={styles.certificate} data-certificate-template aria-label={`${certificate.studentName} EB Academy certificate`}>
      <CertificateCorner className={styles.topLeft} />
      <CertificateCorner className={styles.topRight} />
      <CertificateCorner className={styles.bottomLeft} />
      <CertificateCorner className={styles.bottomRight} />

      <div className={styles.content}>
        <header>
          <div className={styles.seal}>EB</div>
          <div className={styles.academy}>
            <span className={styles.spark} aria-hidden="true" />
            <span>EB Academy</span>
            <span className={styles.spark} aria-hidden="true" />
          </div>
        </header>

        <section>
          <h1 className={styles.title}>Certificate of Completion</h1>
          <div className={styles.rule}><span aria-hidden="true" /></div>
          <p className={styles.presented}>This certificate is proudly presented to</p>
          <p className={styles.studentName}>{certificate.studentName}</p>
          <div className={styles.decoratedLine}><span aria-hidden="true" /></div>
          <p className={styles.completionText}>for successfully completing the training program</p>
          <p className={styles.courseName}>
            <span>{certificate.courseName}</span>
          </p>
          <p className={styles.issuedBy}>Issued by EB Academy under the guidance of Eliano Bou Assi</p>
        </section>

        <section className={styles.bottomRow}>
          <div className={styles.qrArea}>
            <div className={styles.qrFrame}>
              <img src={qrCodeDataUrl} alt={`QR code for certificate ${certificate.code}`} data-verify-url={verifyUrl} />
            </div>
            <p className={styles.qrLabel}>Scan to verify certificate</p>
          </div>

          <div className={styles.details}>
            <DetailRow label="Certificate Code:" value={certificate.code} />
          </div>

          <div className={styles.signatureArea}>
            <img
              className={styles.signatureImage}
              src="/signatures/eliano-bou-assi.png"
              alt="Eliano Bou Assi signature"
            />
            <div className={styles.signatureLine}><span aria-hidden="true" /></div>
            <p className={styles.signatureName}>Eliano Bou Assi</p>
            <p className={styles.signatureTitle}>International Makeup Artist &amp; Beauty Educator</p>
          </div>
        </section>

        <p className={styles.bottomNote}>This certificate verifies the successful completion of the listed EB Academy training program.</p>
      </div>
    </article>
  );
}

function CertificateCorner({ className }: { className: string }) {
  return (
    <div className={`${styles.corner} ${className}`} aria-hidden="true">
      <span className={styles.cornerGlyph} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

function buildVerifyUrl(baseUrl: string, code: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  return `${normalizedBaseUrl}/verify?code=${encodeURIComponent(code)}`;
}
