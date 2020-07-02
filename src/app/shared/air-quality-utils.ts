

export function getNationalAirQualityObjective(obsProperties: {observedProperty: string; unit: string}) {

  const objectives = [
    {
      observedProperty: 'pm10-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      objective: 40 // annual mean
    },
    {
      observedProperty: 'pm2p5-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      objective: 25
    },
    {
      observedProperty: 'nitrogen-dioxide-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      objective: 40 // annual mean
    },
    {
      observedProperty: 'ozone-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      objective: 100
    },
    {
      observedProperty: 'sulphur-dioxide-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      objective: 350 // 1 hour mean, not to be exceeded more than 24 times a year.
    },
    {
      observedProperty: 'nitrogen-oxides-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      objective: 30 // annual mean for vegetation and ecosystems
    }
  ];

  const matching = objectives.find((objective) => {
    return objective.observedProperty === obsProperties.observedProperty && objective.unit === obsProperties.unit;
  })

  if (matching) {
    return matching.objective;
  } else {
    return;
  }

}