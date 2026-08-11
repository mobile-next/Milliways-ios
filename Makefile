.PHONY: all zip ipa clean

all: zip ipa

zip:
	$(MAKE) -C ios zip

ipa:
	$(MAKE) -C ios ipa

clean:
	$(MAKE) -C ios clean
	$(MAKE) -C android clean
