import nodemailer from "nodemailer";

class MailService {
	transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
	async sendActivationMail(to: string, link: string) {
		this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			text:"",
			subject: "Account activation",
			html: `<div>
					<h1>To activate the account please follow this link</h1>
					<a href="${link}">${link}</a>
				</div>`,
		});
	}
}
export default new MailService();
