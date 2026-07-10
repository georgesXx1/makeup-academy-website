export type DownloadableCertificate = {
  studentName: string;
  courseName: string;
  issueDate: string;
  code: string;
};

export function openCertificatePreview(certificate: DownloadableCertificate) {
  window.open(`/certificate?code=${encodeURIComponent(certificate.code)}`, "_blank", "noopener,noreferrer");
}
