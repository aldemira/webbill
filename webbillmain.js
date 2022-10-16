/*
 WebBill 
Copyright (C) 2021  Aldemir Akpinar <aldemir.akpinar@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const config = {
    type: Phaser.AUTO,
    parent: 'gameContainer',
    transparent: 'true',
    pixelArt: true,
    // Set this for game-over
    // backgroundColor: '#4488aa',
    physics: {
        default: 'arcade',
    },
    scene: [ gameMenu, webBill ],
    version: 0.1
    };

let game = new Phaser.Game(config);
