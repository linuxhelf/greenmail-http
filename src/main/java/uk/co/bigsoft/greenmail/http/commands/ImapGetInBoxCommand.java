package uk.co.bigsoft.greenmail.http.commands;

import com.icegreen.greenmail.store.MailFolder;
import com.icegreen.greenmail.user.GreenMailUser;
import com.icegreen.greenmail.util.GreenMail;

import io.javalin.http.Context;

public class ImapGetInBoxCommand extends BaseHandler {

	public ImapGetInBoxCommand(GreenMail greenMail) {
		super(greenMail);
	}

	@Override
	public void handle(Context ctx) throws Exception {
		GreenMailUser u = utils.getUser(ctx, gm.getManagers().getUserManager());
		MailFolder mf = getIm().getInbox(u);
		ctx.json(dto.toMessages(mf, mf.getMessages()));
	}

}
