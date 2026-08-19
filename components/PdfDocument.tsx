import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { BRAND } from "@/lib/brand";
import { computeCo2Equivalences, type BatteryComparison, type RoofCheckResult } from "@/lib/insights";
import type { CalculateResponse, InstallerSettings } from "@/types";

interface PdfDocumentProps {
  result: CalculateResponse;
  installer: InstallerSettings;
  batteryComparison: BatteryComparison | null;
  roofCheck: RoofCheckResult | null;
  projectName?: string;
  addressLine?: string;
}

// Built per-render from the installer's saved brand colours (falling back to
// Brightbox defaults) so the PDF reflects their settings, not just ours.
function getStyles(primaryColor: string, accentColor: string) {
  return StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      fontFamily: "Helvetica",
      color: BRAND.colors.charcoal,
      backgroundColor: BRAND.colors.warmCream,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
      borderBottom: `2 solid ${primaryColor}`,
      paddingBottom: 12,
    },
    logo: { width: 110, height: 44, objectFit: "contain" },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    fallbackIcon: { width: 30, height: 28, objectFit: "contain" },
    fallbackWordmarkPrimary: { fontSize: 13, fontWeight: 700, color: primaryColor },
    fallbackWordmarkAccent: { fontSize: 8, color: accentColor, letterSpacing: 1 },
    companyName: { fontSize: 14, fontWeight: 700, color: primaryColor },
    title: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
    subtitle: { fontSize: 11, color: "#555", marginBottom: 20 },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: primaryColor,
      marginTop: 16,
      marginBottom: 8,
    },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    statBox: {
      width: "31%",
      borderWidth: 1,
      borderColor: BRAND.colors.borderMuted,
      borderRadius: 4,
      padding: 8,
      marginBottom: 10,
    },
    statLabel: { fontSize: 8, color: "#666", textTransform: "uppercase" },
    statValue: { fontSize: 14, fontWeight: 700, color: accentColor, marginTop: 2 },
    monthRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
    insightRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
    insightNote: {
      marginTop: 6,
      padding: 8,
      backgroundColor: "#FBF3DF",
      borderRadius: 4,
      fontSize: 10,
    },
    footer: {
      position: "absolute",
      bottom: 24,
      left: 40,
      right: 40,
      fontSize: 9,
      color: "#777",
      borderTop: `1 solid ${BRAND.colors.borderMuted}`,
      paddingTop: 8,
      textAlign: "center",
    },
  });
}

const gbp = (n: number) =>
  `£${n.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;

export default function PdfDocument({
  result,
  installer,
  batteryComparison,
  roofCheck,
  projectName,
  addressLine,
}: PdfDocumentProps) {
  const { location, solar, payback } = result;
  const styles = getStyles(
    installer.primaryColor || BRAND.colors.mossGreen,
    installer.accentColor || BRAND.colors.warmGold
  );
  const co2 = computeCo2Equivalences(payback.annualCo2SavedKg);

  return (
    <Document
      title={`Solar payback report — ${projectName ? `${projectName} — ` : ""}${location.postcode}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {installer.logoUrl ? (
              <Image src={installer.logoUrl} style={styles.logo} />
            ) : (
              <>
                <Image src="/brightbox-icon.png" style={styles.fallbackIcon} />
                <View>
                  <Text style={styles.fallbackWordmarkPrimary}>BRIGHTBOX</Text>
                  <Text style={styles.fallbackWordmarkAccent}>EFFICIENCY</Text>
                </View>
              </>
            )}
          </View>
          <Text style={styles.companyName}>{installer.companyName || BRAND.name}</Text>
        </View>

        <Text style={styles.title}>{projectName ? projectName : "Solar Payback Report"}</Text>
        <Text style={styles.subtitle}>
          {projectName ? "Solar Payback Report · " : ""}
          {addressLine || location.postcode} · {location.region} · {location.adminDistrict}
        </Text>

        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.grid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Payback period</Text>
            <Text style={styles.statValue}>
              {Number.isFinite(payback.paybackYears) ? `${payback.paybackYears} yrs` : "N/A"}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Annual generation</Text>
            <Text style={styles.statValue}>{solar.annualGenerationKwh.toLocaleString()} kWh</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Annual savings</Text>
            <Text style={styles.statValue}>{gbp(payback.annualSavingsGbp)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Export income</Text>
            <Text style={styles.statValue}>{gbp(payback.annualExportIncomeGbp)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>10-year savings</Text>
            <Text style={styles.statValue}>{gbp(payback.tenYearSavingsGbp)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>25-year savings</Text>
            <Text style={styles.statValue}>{gbp(payback.twentyFiveYearSavingsGbp)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>CO₂ saved / year</Text>
            <Text style={styles.statValue}>{payback.annualCo2SavedKg.toLocaleString()} kg</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Self-consumption</Text>
            <Text style={styles.statValue}>{Math.round(payback.selfConsumptionRate * 100)}%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Monthly generation (kWh)</Text>
        {solar.monthlyGenerationKwh.map((kwh, i) => (
          <View key={i} style={styles.monthRow}>
            <Text>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
            </Text>
            <Text>{Math.round(kwh).toLocaleString()} kWh</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Installer insights</Text>

        {batteryComparison && (
          <View>
            <View style={styles.insightRow}>
              <Text>Extra annual benefit from battery</Text>
              <Text>{gbp(batteryComparison.incrementalAnnualBenefitGbp)}</Text>
            </View>
            <View style={styles.insightRow}>
              <Text>Battery-specific payback</Text>
              <Text>
                {batteryComparison.batteryPaybackYears
                  ? `${batteryComparison.batteryPaybackYears} yrs`
                  : "N/A (no battery cost given)"}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.insightRow}>
          <Text>Equivalent to planting</Text>
          <Text>{co2.treesPlantedPerYear.toLocaleString()} trees/yr</Text>
        </View>
        <View style={styles.insightRow}>
          <Text>Equivalent to not driving</Text>
          <Text>{co2.milesNotDrivenPerYear.toLocaleString()} miles/yr</Text>
        </View>

        {roofCheck && roofCheck.isOverCapacity && (
          <Text style={styles.insightNote}>
            Roof capacity check: a {roofCheck.systemSizeKwp}kWp system is larger than the ~
            {roofCheck.maxViableKwp}kWp this roof size typically supports. Worth confirming
            usable roof area during survey before quoting.
          </Text>
        )}

        <Text style={styles.footer}>
          {installer.companyName || BRAND.name} · {BRAND.tagline}
        </Text>
      </Page>
    </Document>
  );
}
