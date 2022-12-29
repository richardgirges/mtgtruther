# MTG Truther

Grabs a random comment from https://feedback.wizards.com/forums/918667-mtg-arena-bugs-product-suggestions/suggestions/41537692-shuffler-algoritm

## Add it to your Twitch Chat

1. Install MTGBot
2. Run the following command to create a `!shuffle` command

```
!addcom !shuffler %remoteapi https://mtgtruther.herokuapp.com/truth?mode=text&short=true%
```

### Dev Notes

```bash
DATABASE_URL=postgres://postgres@localhost:5432/mtgtruth npm run dev
```
