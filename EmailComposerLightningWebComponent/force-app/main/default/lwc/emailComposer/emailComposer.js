import { LightningElement, track, wire } from 'lwc';
import getRecipients from '@salesforce/apex/CustomEmailController.getRecipients';
import getUserEmail from '@salesforce/apex/CustomEmailController.getUserEmail';
import sendEmailApex from '@salesforce/apex/CustomEmailController.sendEmail';

export default class EmailComposer extends LightningElement {

    @track fromEmail = '';
    @track recipientOptions = [];
    @track selectedRecipient = '';
    @track subject = '';
    @track body = '';

    connectedCallback() {
        getUserEmail().then(result => {
            this.fromEmail = result;
        });
    }

    @wire(getRecipients)
    wiredRecipients({ error, data }) {
        if (data) {
            this.recipientOptions = data.map(r => ({
                label: `${r.Name} (${r.Email})`,
                value: r.Id
            }));
        }
    }

    handleRecipientChange(event) {
        this.selectedRecipient = event.detail.value;
    }

    handleSubject(event) {
        this.subject = event.target.value;
    }

    handleBody(event) {
        this.body = event.target.value;
    }

    sendEmail() {
        if (!this.selectedRecipient || !this.subject) {
            alert('Recipient and Subject are required');
            return;
        }

        sendEmailApex({
            toId: this.selectedRecipient,
            subjectText: this.subject,
            bodyText: this.body
        })
        .then(() => {
            alert('Email sent successfully!');
        })
        .catch(error => {
            console.error(error);
            alert('Error sending email');
        });
    }
}
