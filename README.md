# Ceicom Media Player
Media player para os projetos da Ceicom

### 1ª passo
Coloque o seguinte html onde você quer usar o player

```html
<div class="cmp-player">
    <button type="button" class="btn play-btn"></button>
    <div class="progress-bar-wrapper">
        <div class="progress-bar"></div>
    </div>
    <div class="volume-wrapper">
        <div class="volume-action-wrapper">
            <input type="range" name="points" min="0" max="10" value="10" orient="vertical" class="volume-input">
        </div>
    </div>
    <div class="time">00:00 / 00:00</div>
</div>
```

### 2ª passo
Coloque o css e js do plugin

```html
<link rel="stylesheet" href="caminho-para-o-arquivo/cmp.css">
<script src="caminho-para-o-arquivo/cmp.js"></script>
```

### 3ª passo
Execute o script

```js

// Player de Aúdio
new CeicomMediaPlayer(data);
```
**O player precisa receber um unico parâmetro de data para seu funcionamento**

### 4ª passo
Montando o JSON:

- **track**: Nome da música
- **mp3**: Caminho do MP3 da música
- **type**: Diz para o player se é para carregar o "audio" ou "vídeo" (isso veio de herança do plugin do vimuse)
- **typemedia**: Essa propriedade pode receber 3 parâmetros: 
  - `audio`: Toca a música normalmente e todas as opções são habilitadas.
  - `vinheta`:  Desabilita o botão de pular música e não é exibido na lista (caso tenha uma)
  - `comercial`:  Faz a mesma coisa que a vinheta por enquanto

```json
[
  {
    "track": "Room of Nightmares",
    "mp3": "/test/mp3/room-of-nightmares.mp3",
    "type": "audio",
    "typemedia": "audio"
  }
]
```

### Extras:
Existe algumas funções no player

```js
// Player de Aúdio
const player = new CeicomMediaPlayer(data);

// pega o volume atual do player
player.getVolume();

// altera o volume atual do player
player.setVolume(0.5);
```