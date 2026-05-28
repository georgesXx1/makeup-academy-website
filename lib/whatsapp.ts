export const fallbackWhatsappPhone = "+961 03 575 151";

export function formatWhatsappPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("00")) return formatWhatsappPhone(digits.slice(2));
  if (digits.startsWith("9610")) return `961${digits.slice(4)}`;
  if (digits.startsWith("961")) return digits;
  if (digits.startsWith("0")) return `961${digits.slice(1)}`;

  return digits;
}

export function createWhatsappUrl(phone: string, message?: string) {
  const whatsappPhone = formatWhatsappPhone(phone || fallbackWhatsappPhone);
  const url = new URL(`https://wa.me/${whatsappPhone}`);

  if (message) {
    url.searchParams.set("text", message);
  }

  return url.toString();
}

export function createWhatsappUrlFromContact(contact: { whatsapp?: string; phones?: string[] }, message?: string) {
  const whatsapp = contact.whatsapp?.trim();

  if (whatsapp) {
    if (/^https?:\/\//i.test(whatsapp)) {
      const url = new URL(whatsapp);
      if (message) {
        url.searchParams.set("text", message);
      }
      return url.toString();
    }

    return createWhatsappUrl(whatsapp, message);
  }

  return createWhatsappUrl(contact.phones?.[0] || fallbackWhatsappPhone, message);
}
