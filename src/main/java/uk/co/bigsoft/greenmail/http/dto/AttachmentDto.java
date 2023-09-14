package uk.co.bigsoft.greenmail.http.dto;

import javax.mail.BodyPart;
import javax.mail.MessagingException;

public class AttachmentDto {
    private String filename;

    AttachmentDto(BodyPart part) throws MessagingException {
        filename = part.getFileName();
    }

    public String getFilename() {
        return filename;
    }
}
