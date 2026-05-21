
import { COLORS, SPACING, TYPOGRAPHY } from "./index";
import { StyleSheet, Dimensions } from 'react-native';
import CategoryScreen from "../Screens/Categories";


const { width } = Dimensions.get("window");
export const Categorystyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  header: {
    padding: 18,
    alignItems: "center",
    backgroundColor: "#ff4757",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  toggleRow: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  currentView: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2f3542",
  },

  toggleButton: {
    backgroundColor: "#ff4757",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  categoryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 18,
    padding: 15,
    elevation: 4,
  },

  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2f3542",
  },

  innerScroll: {
    maxHeight: 420,
  },

  flexContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: (width - 70) / 2,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  imageWrapper: {
    width: "100%",
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  image: {
    width: 90,
    height: 90,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f3542",
  },

  type: {
    marginTop: 5,
    fontSize: 13,
    color: "#747d8c",
    textAlign: "center",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  listImage: {
    width: 70,
    height: 70,
    marginRight: 15,
  },

  listName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2f3542",
  },

  listType: {
    marginTop: 5,
    color: "#747d8c",
    fontSize: 14,
  },
  favIcon: {
  position: "absolute",
  top: 8,
  right: 10,
  fontSize: 18,
  height:25,
  width:25
},

grid: {
  justifyContent: "space-between",
},

filterRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  paddingVertical: 10,
},

filterBtn: {
  fontSize: 16,
  color: "#666",
  padding: 6,
},

activeFilter: {
  color: "#ff4757",
  fontWeight: "bold",
  borderBottomWidth: 2,
  borderColor: "#ff4757",
},
favoriteButton: {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 999,
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
  },
  Pressablecontainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  Pressbutton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  text: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
