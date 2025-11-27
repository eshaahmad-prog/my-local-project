public with sharing class CustomEmailController {
    
    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecipients() {
        List<Contact> contacts = [SELECT Id, Name, Email FROM Contact LIMIT 50];
        List<Lead> leads = [SELECT Id, Name, Email FROM Lead LIMIT 50];

        List<sObject> allRecipients = new List<sObject>();
        allRecipients.addAll(contacts);
        allRecipients.addAll(leads);
        return allRecipients;
    }

    @AuraEnabled(cacheable=true)
    public static String getUserEmail() {
        return [SELECT Email FROM User WHERE Id = :UserInfo.getUserId()].Email;
    }

    @AuraEnabled
    public static void sendEmail(Id toId, String subjectText, String bodyText) {

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setTargetObjectId(toId);
        mail.setSubject(subjectText);
        mail.setHtmlBody(bodyText);
        mail.setSaveAsActivity(true);

        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
}
