#!/usr/bin/env python

#
# Copyright Gabriel Synnaeve 2011
# This code is under Python 2 open source license:
# http://www.python.org/download/releases/2.0.1/license/
#

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

import atom
import gdata.contacts.data
import gdata.contacts.client
import gdata.gauth

def GetAuthSubUrl():
    nnext = 'http://contactssharing.appspot.com/list'
    scopes = ['https://www.google.com/m8/feeds/']
    secure = False  # set secure=True to request a secure AuthSub token
    session = True
    return gdata.gauth.generate_auth_sub_url(nnext, scopes, secure=secure, session=session)

class MainHandler(webapp.RequestHandler):
    def get(self):
        #        print '<a href="%s">Login to your Google account</a>' % GetAuthSubUrl()
        user = users.get_current_user()
        if user:
            self.response.headers['Content-Type'] = 'text/html'
            self.response.out.write('Hello, ' + user.nickname() + '<br>')
            self.response.out.write('<a href="%s">Login to your Google account</a>' % GetAuthSubUrl())
        else:
            self.redirect(users.create_login_url(self.request.uri))

def PrintFeed(feed, ctr=0):
    """
    Args:
      feed: A gdata.contacts.ContactsFeed instance.
      ctr: [int] The number of entries in this feed previously printed. This
          allows continuous entry numbers when paging through a feed.
    """
    return feed
    ret = ''
    if not feed.entry:
        ret += '\nNo entries in feed.\n'
        return 0
    for i, entry in enumerate(feed.entry):
        ret += '\n%s %s' % (ctr+i+1, entry.title.text)
        if entry.content:
            ret += '    %s' % (entry.content.text)
        for email in entry.email:
            if email.primary and email.primary == 'true':
                ret += '    %s' % (email.address)
        # Show the contact groups that this contact is a member of.
        for group in entry.group_membership_info:
            ret += '    Member of group: %s' % (group.href)
        # Display extended properties.
        for extended_property in entry.extended_property:
            if extended_property.value:
                value = extended_property.value
            else:
                value = extended_property.GetXmlBlob()
            ret += '    Extended Property %s: %s' % (extended_property.name, value)
    return ret

class ListHandler(webapp.RequestHandler):
    def get(self):
        token = self.request.get("token")
        #auth_sub_scopes = self.request.get("auth_sub_scopes")
        auth_token = gdata.gauth.AuthSubToken(token)
        gd_client = gdata.contacts.client.ContactsClient(auth_token=auth_token, source='test contactssharing')
        self.response.headers['Content-Type'] = 'text/html'
        query = gdata.contacts.client.ContactsQuery()
        query.max_results = 1000
        self.response.out.write(PrintFeed(gd_client.GetContacts(q=query)))

def main():
    application = webapp.WSGIApplication([('/', MainHandler),
        ('/list', ListHandler)],
            debug=True)
    util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
