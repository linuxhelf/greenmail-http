package uk.co.bigsoft.greenmail.http.commands;

import com.icegreen.greenmail.imap.ImapConstants;
import com.icegreen.greenmail.store.MailFolder;
import com.icegreen.greenmail.util.GreenMail;

import io.javalin.http.Context;

public class DeleteMailboxCommand extends BaseHandler {

	public DeleteMailboxCommand(GreenMail greenMail) {
		super(greenMail);
	}

	@Override
	public void handle(Context ctx) throws Exception {
		MailFolder mb = utils.getMailbox(ctx, getIm());
		if (mb.getName().equalsIgnoreCase(ImapConstants.INBOX_NAME)) {
			ctx.json("ERROR");
			return;
		}
		mb.deleteAllMessages();
		getIm().getStore().deleteMailbox(mb);
		mb.expunge();
		ctx.json("OK");
	}

}
