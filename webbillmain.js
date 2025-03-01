/*
 WebBill 
Copyright (C) 2025  Aldemir Akpinar <aldemir.akpinar@gmail.com>

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

import gameMenu from './gamemenu.js';
import webBill from './webbill.js';

var gameMenuScene = new gameMenu();
var webBillScene = new webBill();

const config = {
    type: Phaser.AUTO,
    parent: 'gameContainer',
    transparent: 'true',
    pixelArt: true,
    // Set this for game-over
    // backgroundColor: '#4488aa',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity unless needed
            debug: false
        }
    },
    scene: [ gameMenuScene, webBillScene ],
    version: 0.1
    };

var game = new Phaser.Game(config);
