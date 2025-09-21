import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class Step5Screen extends StatefulWidget {
  const Step5Screen({super.key});

  @override
  State<Step5Screen> createState() => _Step5ScreenState();
}

class _Step5ScreenState extends State<Step5Screen> {
  final Random _random = Random();
  Timer? _timer;
  int tick = 0;

  // Sensor Variables
  double cementFineness = 350; // m²/kg (Blaine)
  double separatorSpeed = 900; // rpm
  double baggingRate = 120; // tons/hr
  double vibrationLevel = 2.0; // mm/s
  double dustEmission = 25; // mg/Nm³

  List<FlSpot> finenessHistory = [];
  List<FlSpot> vibrationHistory = [];
  List<FlSpot> dustHistory = [];

  List<String> alerts = ["Cement mill stable"];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 2), (_) => _simulateData());
  }

  void _simulateData() {
    setState(() {
      tick++;

      cementFineness = 330 + _random.nextDouble() * 40; // 330–370
      separatorSpeed = 880 + _random.nextDouble() * 40; // 880–920
      baggingRate = 100 + _random.nextDouble() * 40; // 100–140
      vibrationLevel = 1.5 + _random.nextDouble() * 1.5; // 1.5–3
      dustEmission = 20 + _random.nextDouble() * 15; // 20–35

      finenessHistory.add(FlSpot(tick.toDouble(), cementFineness));
      vibrationHistory.add(FlSpot(tick.toDouble(), vibrationLevel));
      dustHistory.add(FlSpot(tick.toDouble(), dustEmission));

      if (finenessHistory.length > 20) finenessHistory.removeAt(0);
      if (vibrationHistory.length > 20) vibrationHistory.removeAt(0);
      if (dustHistory.length > 20) dustHistory.removeAt(0);

      // Alerts
      alerts.clear();
      if (vibrationLevel > 2.5) {
        alerts.add("⚠️ High vibration detected in mill");
      }
      if (dustEmission > 30) {
        alerts.add("💨 Dust emission above safe limit");
      }
      if (alerts.isEmpty) {
        alerts.add("ℹ️ Cement mill stable");
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Widget _buildLineChart(List<FlSpot> data, Color color, double minY, double maxY) {
    return LineChart(
      LineChartData(
        minY: minY,
        maxY: maxY,
        gridData: FlGridData(show: true),
        titlesData: FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            isCurved: true,
            spots: data,
            color: color, // ✅ fixed
            barWidth: 3,
            belowBarData: BarAreaData(
              show: true,
              gradient: LinearGradient( // ✅ fixed
                colors: [
                  color.withOpacity(0.3),
                  color.withOpacity(0.0),
                ],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Step 5 — Cement Grinding & Packaging")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            // Cement Fineness
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Cement Fineness (Blaine m²/kg)", style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(height: 150, child: _buildLineChart(finenessHistory, Colors.purple, 320, 380)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Separator Speed + Bagging Rate
            Card(
              elevation: 2,
              child: ListTile(
                leading: const Icon(Icons.settings, color: Colors.blue),
                title: Text("Separator Speed: ${separatorSpeed.toStringAsFixed(1)} rpm"),
                subtitle: Text("Bagging Rate: ${baggingRate.toStringAsFixed(1)} tons/hr"),
              ),
            ),

            const SizedBox(height: 12),

            // Vibration Monitoring
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Mill Vibration Level (mm/s)", style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(height: 150, child: _buildLineChart(vibrationHistory, Colors.orange, 0, 4)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Dust Emission Monitoring
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Dust Emission (mg/Nm³)", style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(height: 150, child: _buildLineChart(dustHistory, Colors.red, 15, 40)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Alerts
            if (alerts.isNotEmpty)
              Card(
                color: Colors.yellow.shade50,
                child: Column(
                  children: alerts
                      .map((msg) => ListTile(
                            leading: Icon(
                              msg.contains("⚠️") || msg.contains("💨") ? Icons.warning : Icons.info,
                              color: msg.contains("⚠️") || msg.contains("💨") ? Colors.red : Colors.blue,
                            ),
                            title: Text(msg),
                          ))
                      .toList(),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
