/**
 * İki semantik versiyon numarasını karşılaştırır
 * @param {string} v1 - Birinci versiyon (ör. "1.2.3")
 * @param {string} v2 - İkinci versiyon (ör. "1.3.0")
 * @returns {number} - Eğer v1 > v2 ise 1, v1 < v2 ise -1, v1 = v2 ise 0
 */
export function compareVersions(v1, v2) {
  const v1Parts = v1.split(".").map(Number);
  const v2Parts = v2.split(".").map(Number);

  // Major versiyon karşılaştırması
  if (v1Parts[0] > v2Parts[0]) return 1;
  if (v1Parts[0] < v2Parts[0]) return -1;

  // Minor versiyon karşılaştırması
  if (v1Parts[1] > v2Parts[1]) return 1;
  if (v1Parts[1] < v2Parts[1]) return -1;

  // Patch versiyon karşılaştırması
  if (v1Parts[2] > v2Parts[2]) return 1;
  if (v1Parts[2] < v2Parts[2]) return -1;

  // Versiyonlar eşit
  return 0;
}

/**
 * Versiyon numarasını artırır (major, minor veya patch)
 * @param {string} version - Mevcut versiyon (ör. "1.2.3")
 * @param {'major'|'minor'|'patch'} type - Artırılacak versiyon tipi
 * @returns {string} - Yeni versiyon numarası
 */
export function incrementVersion(version, type = "patch") {
  const parts = version.split(".").map(Number);

  switch (type) {
    case "major":
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case "minor":
      parts[1] += 1;
      parts[2] = 0;
      break;
    case "patch":
    default:
      parts[2] += 1;
      break;
  }

  return parts.join(".");
}

/**
 * Versiyon numarasının geçerli bir semantik versiyon olup olmadığını kontrol eder
 * @param {string} version - Kontrol edilecek versiyon
 * @returns {boolean} - Geçerli ise true, değilse false
 */
export function isValidVersion(version) {
  const regex = /^(\d+)\.(\d+)\.(\d+)$/;
  return regex.test(version);
}
