# Alfred
A GroupMe bot "butler" made for fun! Built with node.js and Express.js.

## Install Dependencies and Run
```
npm install
node app.js
```
Now you should be able to send `POST` requests to `localhost` to receive Alfred's responses. For best results, make your `POST` body similar to those typically sent by GroupMe. Check [their docs](https://dev.groupme.com/tutorials/bots) for reference on that and other handy tips. A sample `POST` body sent from GroupMe to this bot would be

```
{
  "attachments": [],
  "avatar_url": "http://i.groupme.com/123456789",
  "created_at": 1302623328,
  "group_id": "1234567890",
  "id": "1234567890",
  "name": "John",
  "sender_id": "12345",
  "sender_type": "user",
  "source_guid": "GUID",
  "system": false,
  "text": "Hello world ☃☃",
  "user_id": "1234567890"
}
```

## Register with GroupMe
To register Alfred with your groups on GroupMe, you'll first have to deploy him. I've done so on Heroku, hence why there's a `Procfile` in the repository - feel free to deploy yours on Heroku as well so it can use the same `Procfile`.

Next, you'll have to register him on GroupMe and associate him with a particular group. You can do so via the [GroupMe Bot Dashboard](https://dev.groupme.com/bots), but you'll have to log in with your GroupMe credentials. Once you register him, GroupMe will give you a `bot_id` associated with Alfred for that particular group's `group_id` (you'll see these values on the bot dashboard). Once you have these two values, edit the `credentials.json` to map the `group_id` to the `bot_id`. For example, if Alfred's `bot_id` is `'12345'` for a group with `group_id` equal to `'abcdef'`, the `credentials.json` should look like this.

```
{
    "abcdef": "12345",
    "default": "",
    "super_user": "",
    "giphy": "dc6zaTOxFJmzC"
}
```
Make Alfred responsive to many groups by registering him to them all and adding the corresponding bot/group ID combinations to the `credentials.json` appropriately.

## Pipe logging information to Group
Alfred, will `POST` handy log information using whichever `bot_id` is listed under `default` in the `credentials.json`. For example, if you want Alfred to always `POST` logging information to a group he's registered to with `bot_id` being `'2468'`, the `credentials.json` should look like this.

```
{
    "default": "2468",
    "super_user": "",
    "giphy": "dc6zaTOxFJmzC"
}
```

## Blacklist certain users
If you want certain users to be unable to use Alfred, add their `user_id` (you can get this by checking Alfred's logs) to the `blacklist.json`. If you want to blacklist a user with ID `12345678`, the `blacklist.json` should look like this.

```
[
  "12345678"
]
```

## Add super user
Right now, the only super user commands are Alfred's spam command. If you want to make yourself the only super user and your `user_id` is `12345`, edit the `credentials.json` to look like this.

```
{
    "default": "",
    "super_user": "12345",
    "giphy": "dc6zaTOxFJmzC"
}
```
