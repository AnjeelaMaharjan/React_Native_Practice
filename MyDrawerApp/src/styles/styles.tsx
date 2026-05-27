import { StyleSheet, Platform } from "react-native";
import { BORDER_RADIUS ,SPACING} from "./spacing";
import { TYPOGRAPHY } from "./typography";


export const buttonstyles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  loader: {
    marginVertical: 2,
  },
} as const);

export const GlassCardstyles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    // Subtle shadow / elevation
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, // opacity handled via shadowColor rgba
    shadowRadius: 12,
    elevation: 4,
  },
});

export const ThemeSwitchstyles = StyleSheet.create({
  pill: {
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.smallMedium,
  },
}as const);


export const Headerstyles = StyleSheet.create({
  safeArea: {
    borderBottomWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
}as const);

export const CustomDrawerContentstyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsSection: {
    padding: SPACING.md,
    borderTopWidth: 1,
    gap: SPACING.sm,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  controlLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 11,
    color: '#666',
  },
});



export const Camerastyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconSpacing: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  btnActionText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: 100,
  },
  cameraHeaderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cameraHeaderBtn: {
    padding: SPACING.sm,
  },
  cameraFooter: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  headerClearBtn: {
    padding: 6,
    marginRight: 4,
  },
  headerActionRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    zIndex: 10,
  },
  headerCancelBtn: {
    padding: 6,
  },
  headerDeleteBtn: {
    padding: 6,
  },
  headerSelectBtn: {
    padding: 6,
  },
  topControlContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  actionCardButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    gap: SPACING.xs,
    elevation: 1,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  actionCardButtonText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFF',
  },
  galleryContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  centeredPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  placeholderCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 2,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  placeholderDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: SPACING.sm,
  },
  scrollListContent: {
    paddingVertical: SPACING.sm,
  },
  gridRow: {
    justifyContent: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  gridItemCard: {
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImage: {
    width: '100%',
    height: '70%',
  },
  itemInfo: {
    padding: 8,
    flex: 1,
    justifyContent: 'center',
  },
  itemDateText: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemNotesText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScrollBody: {
    padding: SPACING.md,
  },
  modalPreviewImage: {
    width: '100%',
    height: 280,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#000',
    marginBottom: SPACING.md,
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  notesSection: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  notesInput: {
    height: 70,
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  notesSaveBtn: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesSaveBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOperationsBlock: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  btnModalOp: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  btnModalOpText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  splitRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  btnModalOpSplit: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    gap: SPACING.xs,
  },
  btnModalOpSplitText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFF',
  },
  btnModalOpSplitDanger: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    gap: SPACING.xs,
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  listItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderWidth: 1,
    height: 100,
    marginBottom: SPACING.sm,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  listItemImage: {
    width: 80,
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  listItemInfo: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  listItemNotesText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  listChevron: {
    marginLeft: SPACING.xs,
  },
  listSelectionOverlay: {
    padding: SPACING.xs,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
});