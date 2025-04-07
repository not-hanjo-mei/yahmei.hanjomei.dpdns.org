/**
 * Dot Art Pattern Loader
 * Loads and displays the dot art pattern in the hero section
 */

// Function to initialize the dot art
async function initDotArt() {
  // Get the dot art container element
  const dotArtContainer = document.querySelector('.dot-art-bg');

  // If container doesn't exist, exit
  if (!dotArtContainer) return;

  try {
    // Fetch the dot art pattern from the text file with better path handling
    const response = await fetch('./dotart.txt');
    if (!response.ok) {
      throw new Error(`Failed to load dot art: ${response.status} ${response.statusText}`);
    }

    const dotArtPattern = await response.text();

    // Create a pre element to hold the dot art
    const preElement = document.createElement('pre');
    preElement.className = 'dot-art-text';
    preElement.textContent = dotArtPattern;

    // Clear the container and add the pre element
    dotArtContainer.innerHTML = '';
    dotArtContainer.appendChild(preElement);

    // Make sure the font is loaded
    ensureFontLoaded(preElement, dotArtPattern);
  } catch (error) {
    console.error('Error loading dot art:', error);

    // Fallback to hardcoded pattern if fetch fails
    useFallbackPattern(dotArtContainer);
  }
}

// Function to use a fallback pattern if fetching fails
function useFallbackPattern(container) {
  // Simple fallback pattern (shorter version)
  const fallbackPattern = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠐⡀⠀⡀⠀⠠⠠⡡⢂⠕⡐⢅⠐⡐⡨⢐⠌⢔⠨⡐⠌⢔
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠈⠀⢐⠀⠄⢀⠈⠀⡂⠆⢅⠪⡐⡡⠂⡐⠌⢔⠨⢂⠅⡢⢑⠰
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠐⠈⢀⠂⠠⠀⡀⠁⠄⡃⠢⡑⢔⢐⠁⠄⠕⡐⡡⢂⠅⡢⢁⠪
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠂⠐⠈⢀⠂⢀⠂⠀⠂⡁⡊⢌⠢⡑⠄⠅⠡⡑⡐⠌⢔⠨⡐⠡⢊
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠄⠂⢐⠈⢀⠠⠈⠠⠐⠅⡢⢑⠌⡊⠌⡐⠔⡨⠊⢔⠨⡐⠅⢅`;

  // Create a pre element with the fallback pattern
  const preElement = document.createElement('pre');
  preElement.className = 'dot-art-text';
  preElement.textContent = fallbackPattern;

  // Clear the container and add the pre element
  container.innerHTML = '';
  container.appendChild(preElement);
}

// Function to check and apply font fallbacks if needed
function ensureFontLoaded(preElement, pattern) {
  // Create a test element to check if Cascadia Mono is loaded
  const testElement = document.createElement('span');
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  testElement.style.fontFamily = 'Cascadia Mono, monospace';
  testElement.style.fontSize = '16px';
  testElement.textContent = 'Test Font';
  document.body.appendChild(testElement);

  // Check the computed style
  setTimeout(() => {
    const computedFont = window.getComputedStyle(testElement).fontFamily;

    // If Cascadia Mono isn't available, use a code element with fallback fonts
    if (!computedFont.includes('Cascadia') && !computedFont.includes('CascadiaMono')) {
      const codeElement = document.createElement('code');
      codeElement.style.fontFamily = 'monospace !important';
      codeElement.style.whiteSpace = 'pre';
      codeElement.style.letterSpacing = '0';
      codeElement.style.lineHeight = '1';
      codeElement.textContent = pattern;

      preElement.innerHTML = '';
      preElement.appendChild(codeElement);

      console.log('Using fallback monospace font for dot art');
    }

    // Remove the test element
    document.body.removeChild(testElement);
  }, 500);
}

// Initialize dot art when DOM is loaded
document.addEventListener('DOMContentLoaded', initDotArt);
