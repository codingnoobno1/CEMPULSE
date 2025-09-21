import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class Step13Screen extends StatefulWidget {   // ✅ rename
  const Step13Screen({super.key});

  @override
  State<Step13Screen> createState() => _Step13ScreenState();
}

class _Step13ScreenState extends State<Step13Screen> {  // ✅ rename
  final Random _random = Random();

  // Sensor values
  double temperature = 38;
  double humidity = 45;
  double windSpeed = 12;
  double pressure = 1013;

  double co2 = 785;
  double nox = 380;
  double sox = 95;
  double dust = 28;

  double powerConsumption = 42500;
  double energyEfficiency = 108;
  double carbonCredit = 2850;

  List<PieChartSectionData> pieSections = [];

  @override
  void initState() {
    super.initState();
    _simulateSensors();
    _updatePieData();
  }

  void _simulateSensors() {
    Timer.periodic(const Duration(seconds: 3), (timer) {
      setState(() {
        temperature = 35 + _random.nextDouble() * 5;
        humidity = 40 + _random.nextDouble() * 10;
        windSpeed = 8 + _random.nextDouble() * 6;
        pressure = 1005 + _random.nextDouble() * 15;

        co2 = 750 + _random.nextDouble() * 100;
        nox = 360 + _random.nextDouble() * 80;
        sox = 90 + _random.nextDouble() * 20;
        dust = 25 + _random.nextDouble() * 10;

        powerConsumption = 38000 + _random.nextDouble() * 9000;
        energyEfficiency = 105 + _random.nextDouble() * 10;
        carbonCredit = 2700 + _random.nextDouble() * 500;

        _updatePieData();
      });
    });
  }

  void _updatePieData() {
    final breakdown = [
      {'name': 'Grinding', 'value': 18500 + _random.nextInt(3000), 'color': Colors.blue},
      {'name': 'Kiln', 'value': 15000 + _random.nextInt(2000), 'color': Colors.red},
      {'name': 'Packing', 'value': 4500 + _random.nextInt(1000), 'color': Colors.orange},
      {'name': 'Others', 'value': 4500 + _random.nextInt(1000), 'color': Colors.green},
    ];

    pieSections = breakdown
        .map((item) => PieChartSectionData(
              value: (item['value'] as num).toDouble(),
              color: item['color'] as Color,
              title: item['name'] as String,
              radius: 50,
              titleStyle: const TextStyle(
                  fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
            ))
        .toList();
  }

  Widget _buildEmissionGauge(String label, double value, double limit) {
    double ratio = value / limit;
    Color color = ratio > 0.95
        ? Colors.red
        : ratio > 0.8
            ? Colors.orange
            : Colors.green;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(label, style: const TextStyle(fontSize: 12)),
        const SizedBox(height: 5),
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 80,
              height: 80,
              child: CircularProgressIndicator(
                value: ratio,
                strokeWidth: 8,
                color: color,
                backgroundColor: Colors.grey.shade200,
              ),
            ),
            Text("${value.toStringAsFixed(0)}/${limit.toStringAsFixed(0)}",
                style: const TextStyle(fontSize: 12)),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Energy & Emission Dashboard")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Power Consumption
            Card(
              child: Column(
                children: [
                  const ListTile(
                    leading: Icon(Icons.bolt, color: Colors.blue),
                    title: Text("Power Consumption"),
                  ),
                  SizedBox(
                    height: 200,
                    child: PieChart(
                      PieChartData(
                        sections: pieSections,
                        sectionsSpace: 2,
                        centerSpaceRadius: 30,
                        borderData: FlBorderData(show: false),
                      ),
                    ),
                  ),
                  Text("${(powerConsumption / 1000).toStringAsFixed(1)} MW",
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 16)),
                ],
              ),
            ),

            // Energy Efficiency
            Card(
              child: ListTile(
                leading: const Icon(Icons.battery_charging_full, color: Colors.green),
                title: const Text("Energy Efficiency"),
                trailing: Text("${energyEfficiency.toStringAsFixed(1)} kWh/t"),
              ),
            ),

            // Emissions
            Card(
              child: Column(
                children: [
                  const ListTile(
                    leading: Icon(Icons.factory, color: Colors.red),
                    title: Text("Emissions Monitoring"),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildEmissionGauge("CO₂", co2, 800),
                      _buildEmissionGauge("NOx", nox, 400),
                      _buildEmissionGauge("SOx", sox, 100),
                      _buildEmissionGauge("Dust", dust, 30),
                    ],
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            ),

            // Environmental
            Card(
              child: Column(
                children: [
                  const ListTile(
                    leading: Icon(Icons.thermostat, color: Colors.purple),
                    title: Text("Environmental Conditions"),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(children: [
                        const Text("Temp"),
                        Text("$temperature °C",
                            style: const TextStyle(fontWeight: FontWeight.bold)),
                      ]),
                      Column(children: [
                        const Text("Humidity"),
                        Text("$humidity %",
                            style: const TextStyle(fontWeight: FontWeight.bold)),
                      ]),
                      Column(children: [
                        const Text("Wind"),
                        Text("$windSpeed m/s",
                            style: const TextStyle(fontWeight: FontWeight.bold)),
                      ]),
                      Column(children: [
                        const Text("Pressure"),
                        Text("$pressure hPa",
                            style: const TextStyle(fontWeight: FontWeight.bold)),
                      ]),
                    ],
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            ),

            // Carbon Credit
            Card(
              child: ListTile(
                leading: const Icon(Icons.eco, color: Colors.green),
                title: const Text("Carbon Credit"),
                trailing: Text("$carbonCredit credits"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
