package uk.co.bigsoft.greenmail.http.commands;

import com.icegreen.greenmail.imap.ImapHostManager;
import com.icegreen.greenmail.util.GreenMail;

import io.javalin.http.Handler;
import uk.co.bigsoft.greenmail.http.dto.Dto;

public abstract class BaseHandler implements Handler {
	protected GreenMail gm;
	protected Utils utils = new Utils();
	protected Dto dto = new Dto();
	
	public BaseHandler(GreenMail greenMail) {
		gm = greenMail;
	}

	protected ImapHostManager getIm() {
		// can't be cached as member, or it would be a stale objekt after gm.reset() from ResetCommand
		return gm.getManagers().getUserManager().getImapHostManager();
	}
}
