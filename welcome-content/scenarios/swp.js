function UpdateSWP(addr) {
  let valuePump1 = VB.Read(addr + ".85"/*"L960B17/TRUNK.SUB-24.Parameters.DA_2403.85"*/);
  let valuePump2 = VB.Read("L960B17/TRUNK.SUB-24.Parameters.DA_2404.85");
  let status = VB.Read("L960B17/TRUNK.SUB-24.Parameters.DA_2402.112");

  console.log("value pump1: " + valuePump1);

  console.log("valuePump1: " + valuePump1 + " valuePump2: " + valuePump2 + " status: " + status);

  //water level animation
  if (valuePump1 == 0 && valuePump2 == 0) {
    VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .amin animateTransform[type='translate']", "to", "0 -52.8");
    VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .amin animateTransform[type='scale']", "to", "1 1.6");
  } else {
    VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .amin animateTransform[type='translate']", "to", "0 62");
    VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .amin animateTransform[type='scale']", "to", "1 0.3");
  }

  if (status == "normal") {
    VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .rama use", "class", "nan");

    if (valuePump1 == 1) {
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump1 use", "class", "normal");
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump1 animate", "from", "none");
    } else if (valuePump1 == 0) {
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump1 use", "class", "normal");
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump1 animate", "from", "block");
    }

    if (valuePump2 == 1) {
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump2 use", "class", "normal");
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump2 animate", "from", "none");
    } else if (valuePump2 == 0) {
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump2 use", "class", "normal");
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump2 animate", "from", "block");
    }

  } else if (status == "out_of_service") {
    VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .rama use", "class", "nan");

    if (valuePump1 == 1) {
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump1 use", "class", "outOfService");
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump1 animate", "from", "none");
    } else if (valuePump1 == 0) {
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump1 use", "class", "outOfService");
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump1 animate", "from", "block");
    }

    if (valuePump2 == 1) {
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump2 use", "class", "outOfService");
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump2 animate", "from", "none");
    } else if (valuePump2 == 0) {
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump2 use", "class", "outOfService");
      VB.Attr("g[addr='L960B17/TRUNK.SUB-24.Parameters.DA_2403'] g .pump .pump2 animate", "from", "block");
    }
  }
}
