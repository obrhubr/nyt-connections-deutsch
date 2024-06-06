<p align="center">
	<img alt="Logo" src=".github/icon.svg" data-canonical-src=".github/icon.svg" width="200"/>
</p>

# NYT Connections in German

Try it out at [verbindungen.obrhubr.org](verbindungen.obrhubr.org).

This site is a clone of the popular puzzle published by the New York Times, [Connections](https://www.nytimes.com/games/connections). The objective of the game is to sort 16 words into four different categories.
The goal was to recreate the game as simply as possible, in pure html, css and javascript (without the help of a framework). This allowed me to build it in about 24h.

## Hosting the site

The original site was hosted on Github Pages, but I wanted to add the possibility for my friends to add puzzles too, so I switched to Firebase. You can still view original version at [this commit](https://github.com/obrhubr/nyt-connections-deutsch/commit/3dcf06776e84c31baf2b9e6707b7c44de7ca71ac).

Using Firebase allowed me to add a few very important features. First is the loading of puzzles from a database (specified by an ID encoded in the URL parameter, allowing simple navigation) and of course the possibility of creating and uploading a new puzzle directly from a webpage (see creating new puzzles [here](#Creating-new-Puzzles)).

## Playing connections

When first loading the site you are presented with the blank grid of 16 words of today's puzzle. You can then select different words and check if you were able to correctly identify a category.

The title bar shows the ID of the current puzzle and also the date of creation. This allows users to easily share the puzzle with others, through URL parameters: `verbindungen-game.web.app/?number=K161sMaSf8UE60hcTh45` links to that puzzle directly.
It is also possible to navigate between the puzzles in chronological order with the arrow buttons. They call the Firestore API to fetch the puzzle id and reload the page with the correct URL parameter.

| Initial State | Selected words |
:-------------------------:|:-------------------------:
![Start screen](.github/main.png) | ![4 Words have been selected and highlighted](.github/chosen.png) |
| Solved first category | Reveal |
![Solved the medium category](.github/first.png) | ![Solved all categories](.github/end.png) |

At the end you are prompted with a popup showing the steps you took to reach the end of the game and a button that allows you to copy this short message, enabling you to share it with friends.

```
Verbindungen Puzzle: K161sMaSf8UE60hcTh45
🟩🟨🟨🟪
🟩🟨🟩🟩
🟩🟩🟩🟩
🟦🟦🟨🟦
🟦🟦🟦🟪
🟪🟨🟪🟪
verbindungen-game.web.app/?number=K161sMaSf8UE60hcTh45
```

## Creating new Puzzles

A second page under `/add` allows the user to sign in with credentials, powered by the Firebase authentification service. Only certain users are allowed to upload puzzles, restricting the access.

Once the correct username and password have been provided the user can fill out category names and the corresponding words and upload the puzzle at the end.

| The puzzle creation screen | A few words filled in |
:-------------------------:|:-------------------------:
![Puzzle creation page](.github/creation.png) | ![Partially filled out puzzle](.github/partial.png) |


## Hosting a website that needs a database for free

The goal was to recreate the game as simply as possible, in pure html, css and javascript (without the help of a framework). This allowed me to build the site in about 24h.

At first Github Pages provided the necessary static hosting that powered the site, however the most important limitation was soon reached: adding new puzzles would require me to push a json file to the repository each time. This made it impossible for my friends to create their own puzzles without jumping through a lot of hurdles for non-technical users.

Google’s Firebase allows users to host a static site and a NoSQL Database (Firestore)  entirely for free on their “Spark”-tier. It also provides an authentification service and analytics. 

This is not an advertisement for their service and indeed it felt a bit like selling my soul to Google, as I was signing up and creating the project. But free hosting and a free database is very tempting, especially for a side-project like this. I would not want to incur any costs for hosting such a page at all, however minimal. 

So I guess I should be happy Google allows me to host fun side-projects like this one to share with friends.

### Technical details

The technical details of my implementation are very simple. To create a puzzle you need to sign in with the admin account. A new “document” is then created, where the puzzle is stored in json format. When loading the site, the latest document is fetched from Firestore and you are automatically sent to that puzzle’s page.

Sharing puzzles is also very simple by design: the webapp loads the puzzle id from a url parameter. This makes navigation a matter loading a specific url.
