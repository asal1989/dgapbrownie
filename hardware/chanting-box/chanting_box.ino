#include <SoftwareSerial.h>
#include <Wire.h>
#include <DFRobotDFPlayerMini.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

const uint8_t PIN_RX = 10, PIN_TX = 11, PIN_BUSY = 4;
const uint8_t BTN_PLAY = 2, BTN_NEXT = 3, BTN_PREV = 5, BTN_RESET = 6;
const uint8_t TRACKS = 3;          // /MP3/0001.mp3 .. 0003.mp3
const uint8_t BELL_TRACK = 100;    // /MP3/0100.mp3
const uint16_t TARGET = 108;

const char* NAMES[TRACKS] = { "Om Namah Shivaya", "So Hum", "Om Mani Padme Hum" };

SoftwareSerial dfSerial(PIN_RX, PIN_TX);
DFRobotDFPlayerMini player;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);

uint8_t track = 1;
uint16_t count = 0;
bool playing = false;
bool started = false;   // true once the current track has actually begun (BUSY low)

bool pressed(uint8_t pin) {            // simple debounced press
  if (digitalRead(pin) == LOW) {
    delay(30);
    if (digitalRead(pin) == LOW) {
      while (digitalRead(pin) == LOW) delay(5);
      return true;
    }
  }
  return false;
}

void draw() {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(1);
  oled.setCursor(0, 0);
  oled.print(NAMES[track - 1]);
  oled.setTextSize(3);
  oled.setCursor(0, 22);
  oled.print(count);
  oled.setTextSize(1);
  oled.print(" /");
  oled.print(TARGET);
  oled.setCursor(0, 56);
  oled.print(playing ? "Playing" : "Paused");
  oled.display();
}

void startTrack() {
  player.playMp3Folder(track);
  started = false;
  playing = true;
}

void setup() {
  pinMode(PIN_BUSY, INPUT);
  pinMode(BTN_PLAY, INPUT_PULLUP);
  pinMode(BTN_NEXT, INPUT_PULLUP);
  pinMode(BTN_PREV, INPUT_PULLUP);
  pinMode(BTN_RESET, INPUT_PULLUP);

  dfSerial.begin(9600);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  player.begin(dfSerial);
  player.volume(20);                 // 0-30
  draw();
}

void loop() {
  if (pressed(BTN_PLAY)) {
    if (playing) { player.pause(); playing = false; }
    else if (started) { player.start(); playing = true; }
    else startTrack();
    draw();
  }
  if (pressed(BTN_NEXT)) { track = track % TRACKS + 1; count = 0; startTrack(); draw(); }
  if (pressed(BTN_PREV)) { track = (track == 1) ? TRACKS : track - 1; count = 0; startTrack(); draw(); }
  if (pressed(BTN_RESET)) { count = 0; draw(); }

  if (playing) {
    bool busy = (digitalRead(PIN_BUSY) == LOW);
    if (busy) started = true;
    else if (started) {              // track just finished = one repetition
      count++;
      if (count >= TARGET) {
        player.playMp3Folder(BELL_TRACK);
        count = 0;
        delay(4000);                 // let the bell ring
      }
      startTrack();
      draw();
    }
  }
}
