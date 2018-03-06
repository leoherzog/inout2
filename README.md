![In/Out Board 2](http://i.imgur.com/8FcMfsp.jpg)

# In/Out 2

### Basics

This project is a rewrite of [my old web-based office in/out board](https://github.com/xd1936/inout), written in [Google Apps Script](https://developers.google.com/apps-script/) and powered by Google Calendar. It's a simple HTML table generator that formats and displays a hard-coded list of user's current statuses on Google Calendar.

For each user, you get their **name** (with optional **phone extension**), **free/busy status**, **location**, and **duration of the event**. If the person has shared their calendar with you, you will see if they are free or busy, and if busy, event information available to you. When that user creates a new event in Google Calendar, "Available" vs. "Busy" events determine their status on the board, and "Public" vs. "Private" events determine if the details of the event are visible on the board. If you have more than one event going on at the same time, the board looks at the event that is ending latest.

Because this code is hosted and authenticated server-side on Google Apps Script, there are no dependencies or servers required. It simply generates a web page.

### Setup

1. Create a [new Google Apps Script project](https://script.google.com/) in Google Drive.
2. Copy and paste the code from the `src` folder into six files in the Apps Script project.
3. Go into **Resources** → **Advanced Google services...**, and turn on the **Calendar API v3**. Also follow the *Developer Console* link on this same screen and enable access to the **Google Calendar API** for this project ([more information](https://developers.google.com/apps-script/guides/services/advanced)).
4. Go into the `config.html` file and modify your location name, latitude, longitude (all for the weather), names, phone numbers, and email addresses, as well as whether or not you'd like to show phone extensions.
5. Go into **Publish** → **Deploy as web app...**. Choose the level of access that you want to have on the in/out web page (Under **Who has access to the app:**), and click **Deploy**.

You're done! Share the link to your new In/Out board (the *Current web app URL*), or point a TV to look at that page.

### Updating

When updates are released here on Github, simply copy and paste the newer files in the `src` folder (except your config file) to your project, and go to **Publish** → **Deploy as web app...**. Increment the version number (Pick "New" under the **Project Version** dropdown) and click **Deploy**. You should be good to go!

- - -

Feel free to take a look at the source and adapt as you please. I would love to see some pull requests for improvements to the Javascript.

This source is licensed as follows:

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)

<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Javascript In/Out 2</span> is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

- - -

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/white_img.png)](https://buymeacoff.ee/leoherzog)
