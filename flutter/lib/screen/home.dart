// lib/screen/home.dart
import 'package:flutter/material.dart';
import '../state.dart';
import 'stepcard.dart';

// import all step screens
import 'step1.dart';
import 'step2.dart';
import 'step3.dart';
import 'step4.dart';
import 'step5.dart';
import 'step6.dart';
import 'step7.dart';
import 'step8.dart';
import 'step9.dart';
import 'step10.dart';
import 'step11.dart';
import 'step12.dart';
import 'step13.dart';

class MainDashboard extends StatelessWidget {
  const MainDashboard({super.key});

  // Stage information with custom image URLs
  static final List<StageInfo> stages = [
    StageInfo(
      'Raw Material Extraction',
      'Conveyor speed, material tonnage.',
      imageUrl:
          'https://www.sbbs.com.pl/wp-content/uploads/2019/05/shane-mclendon-534671-unsplash-e1557940274376.jpg',
    ),
    StageInfo(
      'Crushing & Pre-Homogenization',
      'Crusher vibration, feed rate.',
      imageUrl:
          'https://www.lucky-cement.com/wp-content/uploads/2017/01/cement-plant1.jpg',
    ),
    StageInfo(
      'Raw Meal Grinding',
      'Mill speed, grinding pressure.',
      imageUrl:
          'https://ballmillssupplier.com/wp-content/uploads/2020/07/raw-mill-s.jpg',
    ),
    StageInfo(
      'Raw Meal Homogenization',
      'Blending ratios, moisture content.',
      imageUrl:
          'https://cementplantsupplier.com/wp-content/uploads/2021/10/raw-meal-1.jpg',
    ),
    StageInfo(
      'Preheater & Precalciner',
      'Temperature profile, energy usage.',
      imageUrl:
          'https://akm-img-a-in.tosshub.com/businesstoday/images/story/201910/refinery_660_101019095648.jpg',
    ),
    StageInfo(
      'Kiln Operation',
      'Kiln temperature, fuel feed, rotation speed.',
      imageUrl:
          'https://www.cementplantequipment.com/wp-content/uploads/2019/05/cement-kiln.jpg',
    ),
    StageInfo(
      'Clinker Cooling',
      'Cooler pressure, cooling air flow.',
      imageUrl: 'https://4.imimg.com/data4/TH/AX/MY-7778189/1-500x500.jpg',
    ),
    StageInfo(
      'Clinker Storage',
      'Stock levels, humidity control.',
      imageUrl:
          'https://images.unsplash.com/photo-1592878899631-32c45119d470?auto=format&fit=crop&w=800&q=60',
    ),
    StageInfo(
      'Cement Grinding',
      'Mill load, motor power, fineness.',
      imageUrl:
          'https://www.cement-plants.com/wp-content/uploads/2022/04/slag-grinding-production-line.jpg',
    ),
    StageInfo(
      'Cement Storage',
      'Bin levels, pressure, dust control.',
      imageUrl:
          'https://th.bing.com/th/id/OIP.JzT8oQhETP1CjuussIm3awHaE7?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    ),
    StageInfo(
      'Packing & Dispatch',
      'Packing speed, bag weight accuracy.',
      imageUrl:
          'https://tse2.mm.bing.net/th/id/OIP.eOwnfbgufuHRvYXFBmFjfgHaEb?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    ),
    StageInfo(
      'Quality Control',
      'X-Ray analysis, compressive strength data.',
      imageUrl:
          'https://www.thermaxglobal.com/wp-content/uploads/2019/10/WHRB_cement_quotebox.jpg',
    ),
    StageInfo(
      'Energy & Emission Monitoring',
      'Power consumption, CO₂ levels.',
      imageUrl:
          'https://thumbs.dreamstime.com/z/reduce-co-level-concept-carbon-dioxide-emissions-control-to-min-position-stock-vector-231284836.jpg',
    ),
  ];

  // Step screens
  static final List<Widget> stepScreens = const [
    Step1Screen(),
    Step2Screen(),
    Step3Screen(),
    Step4Screen(),
    Step5Screen(),
    Step6Screen(),
    Step7Screen(),
    Step8Screen(),
    Step9Screen(),
    Step10Screen(),
    Step11Screen(),
    Step12Screen(),
    Step13Screen(),
  ];

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;

    // auto adjust columns
    final crossAxisCount = width > 1200
        ? 5
        : width > 900
            ? 4
            : width > 600
                ? 2
                : 1;

    return Scaffold(
      appBar: AppBar(
        title: const Text('CemPulse — Plant Overview'),
        elevation: 1,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          itemCount: stages.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 1, // square cards
          ),
          itemBuilder: (context, i) {
            final stage = stages[i];
            return StepCard(
              title: stage.title,
              description: stage.shortDesc,
              imageUrl: stage.imageUrl ?? '',
              onTap: () {
                if (i < stepScreens.length) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => stepScreens[i]),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Stage ${i + 1} not implemented yet')),
                  );
                }
              },
            );
          },
        ),
      ),
    );
  }
}
