package uk.co.bigsoft.greenmail.http.dto;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.mail.BodyPart;
import javax.mail.Header;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.icegreen.greenmail.store.MailFolder;
import com.icegreen.greenmail.store.StoredMessage;

public class FullMessageDto extends MessageDto {
	private static FlagConverter flagConverter = new FlagConverter();
	private Map<String, String> headers;
	private List<String> flags;
	private List<AttachmentDto> attachments = new ArrayList<>();
	private String body_html;

	public FullMessageDto(MailFolder mailbox, StoredMessage sm) throws MessagingException, IOException {
		super(mailbox, sm);
		MimeMessage mm = sm.getMimeMessage();
		headers = toMap(mm.getAllHeaders());
		flags = flagConverter.toString(sm.getFlags());
		body = "";
		body_html = "";
		Object content = mm.getContent();
		if (content instanceof String) {
			body = content.toString();
		} else if (content instanceof MimeMultipart) {
			this.analyzeBodyParts((MimeMultipart) content);
			this.replaceCIDLinks();
		}

		// String s= mm.getContentID();
		// String[] ss=mm.getContentLanguage();
		// Folder ff = mm.getFolder();
		// int i = mm.getMessageNumber();
		// Date dd = mm.getReceivedDate();
		// List<String> x = toStrings(mm.getReplyTo());
		//
		// MailMessageAttributes mma = sm.getAttributes();
		// String s1 = mma.getBodyStructure(true);
		// String s2 = mma.getBodyStructure(false);
		// String ee = mma.getEnvelope();
		// int sz = mma.getSize();

	}

	private void analyzeBodyParts(MimeMultipart content) throws MessagingException, IOException {
		for (int i = 0; i < content.getCount(); i++) {
			BodyPart part = content.getBodyPart(i);
			if ("attachment".equals(part.getDisposition())) {
				this.attachments.add(new AttachmentDto(part));
			} else if (part.isMimeType("multipart/*")) {
				Object partContent = part.getContent();
				if (partContent instanceof MimeMultipart) {
					this.analyzeBodyParts((MimeMultipart) partContent);
				}
			} else if (part.isMimeType("text/plain")) {
				body += part.getContent();
			} else if (part.isMimeType("text/html")) {
				body_html += part.getContent();
			}
		}

	}

	private void replaceCIDLinks() throws MessagingException {
		this.body_html = this.body_html.replaceAll("=\"cid:",
				"=\"/cid/" + this.getMailbox().replace("#", "%23") + "/" + this.getUid() + "/");
	}

	public Map<String, String> getHeaders() {
		return headers;
	}

	public void setHeaders(Map<String, String> headers) {
		this.headers = headers;
	}

	public String getHtmlBody() {
		return body_html;
	}

	public List<AttachmentDto> getAttachments() {
		return attachments;
	}

	public List<String> getFlags() {
		return flags;
	}

	public void setFlags(List<String> flags) {
		this.flags = flags;
	}

	private Map<String, String> toMap(Enumeration<?> headers) {
		TreeMap<String, String> map = new TreeMap<>();
		while (headers.hasMoreElements()) {
			Header h = (Header) headers.nextElement();
			map.put(h.getName(), h.getValue());
		}

		return map;
	}

}
