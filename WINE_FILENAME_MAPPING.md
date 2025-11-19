# Wine Image Filename Mapping

## 📁 Upload Location
**Folder:** `wine-haven-next/public/wines/`

## 🏷️ Naming Convention
Use the wine name, slugified (lowercase, spaces→hyphens, remove accents/punctuation)

## 📋 Complete Filename List (70 Wines)

### Sparkling/Prosecco (7 wines)
1. `la-marca-prosecco.jpg`
2. `valdo-bio-prosecco.jpg`
3. `1928-prosecco-doc-frizzante-carvicchioli-e-figli.jpg`
4. `valdo-prosecco-rose-brut.jpg`
5. `montegrande-prosecco.jpg`
6. `millage-prosecco-doc-treviso.jpg`
7. `corte-delle-calli-rose-spumante.jpg`

### Rosé (5 wines)
8. `whispering-angel-rose.jpg`
9. `bargemone-rose.jpg`
10. `boutinot-malbek-rose.jpg`
11. `les-cerisiers-cotes-du-rhone-rose.jpg`
12. `lafage-miraflors-rose.jpg`

### Red Wines (33 wines)
13. `brunello-di-montalcino-banfi-2019.jpg`
14. `sequoia-grove-cabernet-sauvignon-napa-valley-2020.jpg`
15. `cloudy-bay-pinot-noir-2022.jpg`
16. `margaux-de-brane-2019.jpg`
17. `frank-phelan-saint-estephe-2018.jpg`
18. `chateau-lilian-ladouys-saint-estephe-2019.jpg`
19. `labastide-dauzac-margaux-2021.jpg`
20. `barolo-docg-patres.jpg`
21. `piedra-negra-malbec-alta-coleccion-2024.jpg`
22. `rupert-rothschild-classique-2009.jpg`
23. `vale-d-maria-douro-superior-2022.jpg`
24. `faustino-i-gran-reserva-2015.jpg`
25. `chateau-tour-de-perrigal-bordeaux-superieur-2021.jpg`
26. `conde-valdemar-rioja-crianza-reserva-2017.jpg`
27. `rioja-vega-crianza-2021.jpg`
28. `ebano-6-ribera-del-duero.jpg`
29. `esporao-reserva-tinto-organic-2022.jpg`
30. `terrazas-de-los-andes-malbec-2022.jpg`
31. `portillo-malbec-2022.jpg`
32. `fin-del-mundo-malbec-2022.jpg`
33. `crozes-hermitage-delas-2022.jpg`
34. `bertani-valpolicella-ripasso.jpg`
35. `castello-di-albola-chianti-classico.jpg`
36. `valmoissine-pinot-noir-louis-latour-2022.jpg`
37. `grand-veneur-cotes-du-rhone-2023.jpg`
38. `geyerhof-stockwerk-zweigelt.jpg`
39. `barahonda-organic-monastrellmerlot-2018.jpg`
40. `corazon-de-lolita-premium-coupage.jpg`
41. `bread-butter-pinot-noir-2023.jpg`
42. `lafage-miraflors-red.jpg`
43. `pasqua-zin-primitivo.jpg`
44. `pasqua-morago-appassite.jpg`
45. `plaimont-colombelle-tannat-cabernet-sauvignon.jpg`
46. `integral-3-unfiltered.jpg`
47. `victor-berard-chateauneuf-du-pape-2024.jpg`

### White Wines (25 wines)
48. `cloudy-bay-chardonnay-2022.jpg`
49. `sequoia-grove-chardonnay-2021.jpg`
50. `cloudy-bay-sauvignon-blanc-2024.jpg`
51. `chablis-la-sereine.jpg`
52. `rupert-rothschild-baroness-nadine-chardonnay-2023.jpg`
53. `sancerre-2023.jpg`
54. `louis-jadot-macon-lugny-2023.jpg`
55. `domaine-gueneau-sancerre-la-guiberte-2024.jpg`
56. `assyrtiko-papagiannakos.jpg`
57. `geyerhof-stockwerk-gruner-veltliner.jpg`
58. `lolo-albarino.jpg`
59. `terrazas-de-los-andes-chardonnay-2024.jpg`
60. `protos-verdejo-2024.jpg`
61. `picpoul-de-pinet-domaine-de-la-madone-2023.jpg`
62. `viore-verdejo-sobre-lias-2022.jpg`
63. `lagar-de-besada-albarino.jpg`
64. `bread-butter-chardonnay-2023.jpg`
65. `3-wooly-sheep-sauvignon-blanc.jpg`
66. `salisbury-1848-chardonnay-2024.jpg`
67. `faustino-vii-blanco.jpg`
68. `lafage-miraflors-blanc.jpg`
69. `hans-baer-riesling-trocken.jpg`

## ✅ Quick Steps

1. **Rename your 70 photos** using the filenames above
2. **Upload them** to `wine-haven-next/public/wines/`
3. **Run the script:** `node scripts/update-wine-images.js`
4. **Done!** The JSON will be updated automatically

## 💡 Tips

- Use `.jpg` or `.png` extension
- If a filename doesn't match exactly, the script will try partial matching
- The script will show you which wines don't have matches

