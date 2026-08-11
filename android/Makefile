GRADLEW = ./gradlew
APK_PATH = app/build/outputs/apk/debug/app-debug.apk

.PHONY: build lint clean

build:
	$(GRADLEW) assembleDebug
	@echo "Created $(APK_PATH)"

lint:
	$(GRADLEW) lint
	@echo "Lint report: app/build/reports/lint-results-debug.html"

clean:
	$(GRADLEW) clean
