#include <Arduino.h>

void setup() {
  Serial.begin(9600);
  pinMode(10, INPUT); // Leads off detection LO+
  pinMode(11, INPUT); // Leads off detection LO-
}

void loop() {
  if ((digitalRead(10) == 1) || (digitalRead(11) == 1)) {
    Serial.println("!");
  } else {
    int ecgValue = analogRead(A0);
    Serial.println(ecgValue);
  }
  delay(1);
}
