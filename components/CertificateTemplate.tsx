import type { CSSProperties } from "react";
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
  const studentNameStyle = getStudentNameStyle(certificate.studentName);
  const courseNameStyle = getCourseNameStyle(certificate.courseName);

  return (
    <article className={styles.certificate} data-certificate-template aria-label={`${certificate.studentName} EB Academy certificate`}>
      <CertificateCorner className={styles.topLeft} />
      <CertificateCorner className={styles.topRight} />
      <CertificateCorner className={styles.bottomLeft} />
      <CertificateCorner className={styles.bottomRight} />

      <div className={styles.content}>
        <header>
          <img className={styles.brandLogo} src="/brand-logo.png" alt="EB Academy logo" />
          <div className={styles.brandWordmark}>Academy</div>
        </header>

        <section className={styles.mainContent}>
          <h1 className={styles.title}>Certificate of Completion</h1>
          <div className={styles.rule}><span aria-hidden="true" /></div>
          <p className={styles.studentName} style={studentNameStyle}>{certificate.studentName}</p>
          <div className={styles.decoratedLine}><span aria-hidden="true" /></div>
          <p className={styles.completionText}>for successfully completing the training program</p>
          <p className={styles.courseName} style={courseNameStyle}>
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
            <div className={styles.signatureImage} aria-label="Eliano Bou Assi signature">Eliano</div>
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

type CertificateTextStyle = CSSProperties & {
  "--text-size"?: string;
  "--text-spacing"?: string;
};

function getStudentNameStyle(value: string): CertificateTextStyle {
  const normalized = value.trim();
  const longestWord = getLongestWordLength(normalized);
  const length = normalized.length;

  if (length > 40 || longestWord > 18) {
    return { "--text-size": "32px", "--text-spacing": "0.025em" };
  }

  if (length > 30 || longestWord > 14) {
    return { "--text-size": "38px", "--text-spacing": "0.035em" };
  }

  if (length > 22) {
    return { "--text-size": "42px", "--text-spacing": "0.045em" };
  }

  return { "--text-size": "48px", "--text-spacing": "0.055em" };
}

function getCourseNameStyle(value: string): CertificateTextStyle {
  const normalized = value.trim();
  const longestWord = getLongestWordLength(normalized);
  const length = normalized.length;

  if (length > 48 || longestWord > 18) {
    return { "--text-size": "22px", "--text-spacing": "0.01em" };
  }

  if (length > 34 || longestWord > 14) {
    return { "--text-size": "26px", "--text-spacing": "0.015em" };
  }

  return { "--text-size": "31px", "--text-spacing": "0.02em" };
}

function getLongestWordLength(value: string) {
  return value.split(/\s+/).reduce((longest, word) => Math.max(longest, word.length), 0);
}
