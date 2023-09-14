package uk.co.bigsoft.greenmail.http.commands;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.icegreen.greenmail.store.MailFolder;
import com.icegreen.greenmail.store.StoredMessage;
import com.icegreen.greenmail.util.GreenMail;

import io.javalin.http.Context;

public class AttachmentDownloadCommand extends BaseHandler {

    public AttachmentDownloadCommand(GreenMail greenMail) {
        super(greenMail);
    }

    @Override
    public void handle(Context ctx) throws Exception {
        MailFolder mailbox = utils.getMailbox(ctx, im);
        long uid = utils.getUid(ctx);
        String filename = ctx.pathParam("filename");
        StoredMessage sm = mailbox.getMessage(uid);
        MimeMessage mime = sm.getMimeMessage();
        Object content = mime.getContent();
        if (content instanceof MimeMultipart && filename != null) {
            BodyPart part = this.findPart((MimeMultipart) content, filename);
            if (part != null) {
                ctx.header("Content-Disposition", "attachment; filename=\"" + filename + "\"");
                ctx.header("Content-Type", part.getContentType());
                ctx.result(part.getInputStream());
            }
        }
    }

    private BodyPart findPart(MimeMultipart content, String filename) throws MessagingException, IOException {
        for (int i = 0; i < content.getCount(); i++) {
            BodyPart part = content.getBodyPart(i);
            String[] contentIdHeaders = part.getHeader("Content-ID");
            List<String> contentIds = contentIdHeaders != null ? Arrays.asList(contentIdHeaders)
                    : Collections.emptyList();

            if (("attachment".equals(part.getDisposition()) && filename.equals(part.getFileName()))
                    || ("inline".equals(part.getDisposition()) && contentIds.contains("<" + filename + ">"))) {
                return part;
            } else if (part.isMimeType("multipart/*")) {
                Object c = part.getContent();
                if (c instanceof MimeMultipart) {
                    BodyPart p = findPart((MimeMultipart) c, filename);
                    if (p != null) {
                        return p;
                    }
                }
            }
        }
        return null;
    }
}
