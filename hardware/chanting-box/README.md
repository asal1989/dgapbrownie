# Chanting box (electronics prototype)

A small battery-powered box that plays a mantra on repeat, counts repetitions (one japa mala = 108) and rings a bell at 108.

## Parts (about 800-1200 INR)
| Part | Purpose |
|---|---|
| Arduino Nano (or ESP32 for later Wi-Fi/Bluetooth) | brain |
| DFPlayer Mini + microSD card | plays MP3 files |
| 3 W 4-ohm speaker (40 mm) | sound |
| 0.96" SSD1306 I2C OLED | shows mantra number and count |
| 4 push buttons | Play/Pause, Next, Previous, Reset count |
| 1 kohm resistor | between Nano and DFPlayer RX |
| 18650 cell + TP4056 charging module + boost to 5 V | portable power |
| Slide switch, LED (optional) | power, bell indicator |

## Wiring (Arduino Nano)
```
DFPlayer VCC -> 5V        DFPlayer GND -> GND
DFPlayer TX  -> D10       DFPlayer RX  -> D11 via 1k resistor
DFPlayer BUSY-> D4        (goes LOW while a track plays - used for counting)
DFPlayer SPK1/SPK2 -> speaker
OLED SDA -> A4   OLED SCL -> A5   VCC -> 5V   GND -> GND
Buttons (other leg to GND): Play/Pause D2, Next D3, Prev D5, Reset D6
```

## SD card layout
Format FAT32. Create a folder named `MP3` and add:
```
/MP3/0001.mp3   Om Namah Shivaya
/MP3/0002.mp3   So Hum
/MP3/0003.mp3   Om Mani Padme Hum
/MP3/0100.mp3   Bell (played at 108)
```
Record each mantra as ONE chant (a few seconds) so every end-of-track is one repetition.

## How counting works
The BUSY pin goes HIGH when a track ends. Each end = +1, then the same track restarts. At 108 the bell plays and the count resets.

## Build steps
1. Test the DFPlayer alone with the library's example sketch.
2. Add the OLED, then the buttons.
3. Upload `chanting_box.ino` (libraries: DFRobotDFPlayerMini, Adafruit SSD1306, Adafruit GFX).
4. Fit everything in a box (wood/3D-printed) with speaker holes, a window for the OLED, and a USB charging port.

## Later ideas
Rotary encoder for volume, EEPROM to remember total count, ESP32 + the website's `/api/mantras` to download the mantra list, a vibration motor or LED ring that lights 1 of 108.

Status: sketch is a starter and has not been compiled or run on hardware.
