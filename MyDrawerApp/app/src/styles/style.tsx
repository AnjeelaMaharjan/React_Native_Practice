import { StyleSheet } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "./index";

    export const Categoriesstyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
      },
      toggleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderColor: "#eef2f3",
      },
      viewStateText: {
        fontSize: 14,
        color: "#7f8c8d",
      },
      toggleButton: {
        backgroundColor: "#3498db",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
      },
      toggleButtonText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
      },
      verticalListPadding: {
        paddingVertical: 10,
      },
      horizontalPadding: {
        paddingLeft: 16,
        paddingRight: 6,
      },
       VerticalPadding: {
        paddingLeft: 16,
        paddingRight: 6,
      },
      listContainerPadding: {
        paddingHorizontal: 16,
      },
      categoryContainer: {
        marginBottom: 20,
      },
      categoryTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2c3e50",
        marginBottom: 10,
        paddingHorizontal: 16,
      },
      /* --- CARD VIEW STYLES --- */
      card: {
        width: 140,
        height: 190,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#eef2f3",
        overflow: "hidden",
      },
      imageContainer: {
        flex: 5,
        backgroundColor: "#fdfefe",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
      },
      pokemonImage: {
        width: "100%",
        height: "100%",
      },
      cardFooter: {
        flex: 4,
        paddingHorizontal: 8,
        justifyContent: "center",
      },
      itemName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: 2,
      },
      itemType: {
        fontSize: 11,
        color: "#95a5a6",
      },
      /* --- LIST VIEW STYLES --- */
      listItem: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eef2f3",
      },
      listImage: {
        width: 50,
        height: 50,
        marginRight: 14,
      },
      listTextContainer: {
        flex: 1,
      },
      listNameText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
      },
      listTypeText: {
        fontSize: 13,
        color: "#7f8c8d",
        marginTop: 2,
      },
    
});

export const PokemonDetailstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    padding: 20,
    alignItems: "center",
  },
  detailCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  pokemonIdText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#bdc3c7",
    alignSelf: "flex-start",
  },
  largeImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  pokemonNameText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  pokemonTypeText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#eceff1",
    width: "100%",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#34495e",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },
  statLabel: {
    color: "#7f8c8d",
    fontWeight: "600",
  },
  statValue: {
    color: "#2c3e50",
    fontWeight: "bold",
  },
});


export const Profilestyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[50] },
  content: { padding: SPACING.lg },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary[600],
    marginBottom: SPACING.md,
  },
  cardDescription: { ...TYPOGRAPHY.body, color: COLORS.gray[600] },
  

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary[600],
    marginBottom: SPACING.sm,
  },
  modalBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray[600],
    marginBottom: SPACING.lg,
  },
  modalButtonContainer: {
    marginTop: SPACING.sm,
  }
});
