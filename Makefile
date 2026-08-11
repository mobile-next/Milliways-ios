.PHONY: all zip ipa apk clean

all: zip ipa apk

zip:
	$(MAKE) -C ios zip

ipa:
	$(MAKE) -C ios ipa

apk:
	$(MAKE) -C android build

clean:
	$(MAKE) -C ios clean
	$(MAKE) -C android clean
