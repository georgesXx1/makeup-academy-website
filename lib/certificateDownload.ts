export type DownloadableCertificate = {
  studentName: string;
  courseName: string;
  issueDate: string;
  code: string;
};

const CERTIFICATE_WIDTH = 1600;
const CERTIFICATE_HEIGHT = 1080;

export async function downloadCertificatePng(certificate: DownloadableCertificate) {
  const canvas = document.createElement("canvas");
  canvas.width = CERTIFICATE_WIDTH;
  canvas.height = CERTIFICATE_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) return;

  drawCertificateBase(context, certificate);

  const verifyUrl = `${window.location.origin}/verify?code=${encodeURIComponent(certificate.code)}`;
  const qrImage = await loadSafeQrImage(verifyUrl);

  if (qrImage) {
    context.drawImage(qrImage, 1300, 830, 220, 220);
  } else {
    drawQrFallback(context, certificate.code);
  }

  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFilename(certificate.studentName)}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

function drawCertificateBase(context: CanvasRenderingContext2D, certificate: DownloadableCertificate) {
  context.fillStyle = "#fbfbfb";
  context.fillRect(0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);

  context.strokeStyle = "#202020";
  context.lineWidth = 3;
  context.strokeRect(34, 40, 1532, 1000);

  context.strokeStyle = "#808080";
  context.lineWidth = 1.5;
  context.strokeRect(50, 56, 1500, 968);

  drawCornerLines(context);
  drawCenteredText(context, "EB", 800, 132, "70px Georgia, serif", "#151313", 4);
  drawCenteredText(context, "EB ACADEMY", 800, 215, "54px Georgia, serif", "#151313", 18);
  drawCenteredText(context, "ELIANO BOU ASSI ACADEMY", 800, 255, "16px Arial, sans-serif", "#151313", 12);

  drawCenteredText(context, "CERTIFICATE OF COMPLETION", 800, 372, "48px Georgia, serif", "#151313", 12);
  drawLine(context, 620, 420, 980, 420, "#777", 2);
  drawCenteredText(context, "THIS CERTIFICATE IS PROUDLY PRESENTED TO", 800, 478, "18px Arial, sans-serif", "#444", 7);

  drawCenteredText(context, certificate.studentName, 800, 590, "78px Georgia, serif", "#151313", 0, 980);
  drawLine(context, 260, 632, 1340, 632, "#151313", 3);

  drawCenteredText(context, "FOR SUCCESSFULLY COMPLETING", 800, 690, "18px Arial, sans-serif", "#333", 5);
  drawCenteredText(context, certificate.courseName, 800, 738, "34px Georgia, serif", "#151313", 3, 900);

  context.font = "18px Arial, sans-serif";
  context.fillStyle = "#333";
  context.fillText(`CERTIFICATE ID: ${certificate.code}`, 220, 925);

  drawLine(context, 120, 965, 410, 965, "#151313", 2);
  drawCenteredText(context, certificate.issueDate, 265, 1000, "18px Arial, sans-serif", "#333", 4);

  drawLine(context, 510, 965, 810, 965, "#151313", 2);
  drawCenteredText(context, "INSTRUCTOR SIGNATURE", 660, 1000, "18px Arial, sans-serif", "#333", 4);

  drawLine(context, 930, 965, 1230, 965, "#151313", 2);
  drawCenteredText(context, "DIRECTOR SIGNATURE", 1080, 1000, "18px Arial, sans-serif", "#333", 4);

  context.strokeStyle = "#151313";
  context.lineWidth = 2;
  context.strokeRect(1324, 770, 172, 42);
  drawCenteredText(context, "Code", 1410, 797, "18px Arial, sans-serif", "#151313", 0);
  drawCenteredText(context, certificate.code, 1410, 826, "14px Arial, sans-serif", "#151313", 0);
}

function drawCornerLines(context: CanvasRenderingContext2D) {
  const corners = [
    [70, 74, 150, 74, 70, 154],
    [1530, 74, 1450, 74, 1530, 154],
    [70, 1006, 150, 1006, 70, 926],
    [1530, 1006, 1450, 1006, 1530, 926],
  ];

  context.strokeStyle = "#202020";
  context.lineWidth = 2;
  corners.forEach(([x1, y1, x2, y2, x3, y3]) => {
    drawLine(context, x1, y1, x2, y2, "#202020", 2);
    drawLine(context, x1, y1, x3, y3, "#202020", 2);
  });
}

function drawQrFallback(context: CanvasRenderingContext2D, code: string) {
  context.fillStyle = "#fff";
  context.fillRect(1300, 830, 220, 220);
  context.strokeStyle = "#151313";
  context.lineWidth = 3;
  context.strokeRect(1300, 830, 220, 220);

  for (let row = 0; row < 11; row += 1) {
    for (let column = 0; column < 11; column += 1) {
      const charCode = code.charCodeAt((row * 11 + column) % code.length);
      if ((charCode + row + column) % 3 === 0) {
        context.fillStyle = "#151313";
        context.fillRect(1320 + column * 16, 850 + row * 16, 12, 12);
      }
    }
  }
}

async function loadSafeQrImage(verifyUrl: string) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(verifyUrl)}`;

  try {
    await image.decode();
    const testCanvas = document.createElement("canvas");
    testCanvas.width = 1;
    testCanvas.height = 1;
    testCanvas.getContext("2d")?.drawImage(image, 0, 0, 1, 1);
    testCanvas.toDataURL("image/png");
    return image;
  } catch {
    return null;
  }
}

function drawCenteredText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  fillStyle: string,
  letterSpacing = 0,
  maxWidth?: number,
) {
  context.font = font;
  context.fillStyle = fillStyle;
  context.textAlign = "center";
  context.textBaseline = "alphabetic";

  if (maxWidth && context.measureText(text).width > maxWidth) {
    const fontSize = Number(font.match(/(\d+)px/)?.[1] ?? 24);
    const nextSize = Math.max(24, Math.floor((maxWidth / context.measureText(text).width) * fontSize));
    context.font = font.replace(/\d+px/, `${nextSize}px`);
  }

  if (!letterSpacing) {
    context.fillText(text, x, y);
    return;
  }

  const characters = [...text];
  const totalWidth = characters.reduce((width, character) => width + context.measureText(character).width, 0) + letterSpacing * (characters.length - 1);
  let currentX = x - totalWidth / 2;
  context.textAlign = "left";

  characters.forEach((character) => {
    context.fillText(character, currentX, y);
    currentX += context.measureText(character).width + letterSpacing;
  });
}

function drawLine(context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, strokeStyle: string, lineWidth: number) {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.stroke();
}

function safeFilename(value: string) {
  return value.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, "").replace(/\s+/g, " ") || "certificate";
}
