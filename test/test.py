import pyautogui
import time

# Definieren Sie die Koordinaten und die Zielkoordinaten
oberflaeche_x = 839
oberflaeche_y = 804
ziel_x = 1993
ziel_y = 453

# Festlegen der Zeitverzögerung zwischen den Klicks
klick_verzoegerung = 1  # Sekunden

# Funktion zur Überprüfung von Farbänderungen an den überwachten Koordinaten
def ueberwache_farbwechsel(oberflaeche_x, oberflaeche_y, standard_farbe):
    while True:
        aktuelle_farbe = pyautogui.pixel(oberflaeche_x, oberflaeche_y)
        if aktuelle_farbe != standard_farbe:
            # Farbänderung erkannt, führe Mausklick aus und bewege die Maus
            pyautogui.click(oberflaeche_x, oberflaeche_y)
            time.sleep(klick_verzoegerung)
            pyautogui.moveTo(ziel_x, ziel_y)
            pyautogui.click()
            # Aktualisiere die Standardfarbe
            standard_farbe = aktuelle_farbe
        time.sleep(1)  # Überwachung in Intervallen

try:
    # Nehmen Sie die Anfangsfarbe an den überwachten Koordinaten auf
    standard_farbe = pyautogui.pixel(oberflaeche_x, oberflaeche_y)

    # Starten Sie die Überwachung
    ueberwache_farbwechsel(oberflaeche_x, oberflaeche_y, standard_farbe)

except KeyboardInterrupt:
    print("Bot beendet.")
